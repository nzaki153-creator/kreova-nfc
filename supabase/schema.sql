-- ============================================
-- KREOVA — SCHEMA TAHAP 1 (Fondasi & Profil Digital)
-- Jalankan di Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Tabel profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text,
  photo text,
  university text,
  major text,
  year text,
  whatsapp text,
  instagram text,
  linkedin text,
  username text unique,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil digital mahasiswa Kreova (ditampilkan saat kartu NFC ditap).';

-- Index bantu pencarian by username (untuk halaman publik nanti)
create index if not exists profiles_username_idx on public.profiles (username);

-- 2. Row Level Security
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- 3. Trigger: otomatis buat baris "profiles" saat ada user baru di auth.users.
-- Dipakai (bukan insert manual dari aplikasi) supaya tetap jalan walaupun
-- project ini mewajibkan konfirmasi email (saat itu belum ada session aktif,
-- jadi insert manual dari client akan ditolak RLS).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Storage bucket untuk foto profil
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Foto bisa dibaca publik (karena tampil di profil digital)
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Tapi hanya pemilik yang boleh upload/update/hapus foto miliknya sendiri.
-- File disimpan dengan path: {user_id}/avatar.ext
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- TAHAP 2 (Public Digital Profile) — tambahan
-- ============================================

-- 5. RLS tambahan: siapa pun (termasuk yang belum login) boleh membaca
-- baris profile yang statusnya sudah published. Ini TIDAK melonggarkan
-- akses ke profile yang belum published — policy "Users can view own
-- profile" di atas tetap berlaku untuk pemilik, dan beberapa policy SELECT
-- pada tabel yang sama digabung dengan OR oleh Postgres, jadi kombinasi
-- keduanya aman.
drop policy if exists "Public can view published profiles" on public.profiles;
create policy "Public can view published profiles"
  on public.profiles for select
  using (is_published = true);

-- 6. Fungsi kecil untuk membedakan "username tidak pernah terdaftar" vs
-- "username terdaftar tapi belum published", TANPA mengekspos isi profile
-- yang belum published ke publik. Hanya mengembalikan true/false.
create or replace function public.profile_exists(check_username text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where username = check_username
  );
$$;

grant execute on function public.profile_exists(text) to anon, authenticated;
