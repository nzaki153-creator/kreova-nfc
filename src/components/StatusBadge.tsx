interface StatusBadgeProps {
  isPublished: boolean;
}

export function StatusBadge({ isPublished }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isPublished
          ? "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/30"
          : "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/30"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPublished ? "bg-emerald-400" : "bg-amber-400"
        }`}
      />
      {isPublished ? "Published" : "Not Published"}
    </span>
  );
}
