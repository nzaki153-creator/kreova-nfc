"use client";

import { useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui/Button";

interface PhotoCropModalProps {
  imageUrl: string;
  fileName: string;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

interface Size {
  width: number;
  height: number;
}

interface Offset {
  x: number;
  y: number;
}

const FRAME_SIZE = 280; // px - ukuran area crop persegi yang terlihat di layar
const OUTPUT_SIZE = 640; // px - resolusi hasil crop yang benar-benar diupload
const MAX_ZOOM = 3;

function clampOffset(next: Offset, size: Size, zoom: number): Offset {
  const baseScale = FRAME_SIZE / Math.min(size.width, size.height);
  const scale = baseScale * zoom;
  const displayedWidth = size.width * scale;
  const displayedHeight = size.height * scale;
  const minX = Math.min(0, FRAME_SIZE - displayedWidth);
  const minY = Math.min(0, FRAME_SIZE - displayedHeight);

  return {
    x: Math.min(0, Math.max(minX, next.x)),
    y: Math.min(0, Math.max(minY, next.y)),
  };
}

/**
 * Modal untuk menyesuaikan (crop) foto sebelum diupload - user bisa geser
 * posisi dan zoom, lalu hasilnya di-render ke canvas persegi berukuran
 * tetap (sekaligus jadi cara mengecilkan ukuran file sebelum upload).
 */
export function PhotoCropModal({ imageUrl, fileName, onCancel, onConfirm }: PhotoCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null,
  );

  const [naturalSize, setNaturalSize] = useState<Size | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  function handleImageLoad() {
    const img = imgRef.current;
    if (!img) return;

    const size: Size = { width: img.naturalWidth, height: img.naturalHeight };
    const baseScale = FRAME_SIZE / Math.min(size.width, size.height);
    const displayedWidth = size.width * baseScale;
    const displayedHeight = size.height * baseScale;

    setNaturalSize(size);
    setZoom(1);
    setOffset({
      x: (FRAME_SIZE - displayedWidth) / 2,
      y: (FRAME_SIZE - displayedHeight) / 2,
    });
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragState.current = { startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState.current || !naturalSize) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const next = { x: dragState.current.originX + dx, y: dragState.current.originY + dy };
    setOffset(clampOffset(next, naturalSize, zoom));
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  function handleZoomChange(e: ChangeEvent<HTMLInputElement>) {
    const nextZoom = Number(e.target.value);
    setZoom(nextZoom);
    if (naturalSize) {
      setOffset((prev) => clampOffset(prev, naturalSize, nextZoom));
    }
  }

  async function handleConfirm() {
    const img = imgRef.current;
    if (!img || !naturalSize) return;

    setIsProcessing(true);

    const baseScale = FRAME_SIZE / Math.min(naturalSize.width, naturalSize.height);
    const scale = baseScale * zoom;

    const sourceX = -offset.x / scale;
    const sourceY = -offset.y / scale;
    const sourceSize = FRAME_SIZE / scale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );

    setIsProcessing(false);

    if (!blob) return;

    const croppedName = `${fileName.replace(/\.[^.]+$/, "")}-cropped.jpg`;
    onConfirm(new File([blob], croppedName, { type: "image/jpeg" }));
  }

  const displayWidth = naturalSize
    ? naturalSize.width * (FRAME_SIZE / Math.min(naturalSize.width, naturalSize.height)) * zoom
    : undefined;
  const displayHeight = naturalSize
    ? naturalSize.height * (FRAME_SIZE / Math.min(naturalSize.width, naturalSize.height)) * zoom
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-kreova-border bg-kreova-card p-5">
        <h2 className="text-sm font-semibold text-white">Sesuaikan Foto</h2>
        <p className="mt-1 text-xs text-kreova-muted">
          Geser untuk memposisikan, gunakan slider untuk zoom.
        </p>

        <div
          className="relative mx-auto mt-4 touch-none overflow-hidden rounded-2xl bg-kreova-surface"
          style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Foto yang akan di-crop"
            onLoad={handleImageLoad}
            draggable={false}
            className="absolute left-0 top-0 max-w-none select-none"
            style={
              displayWidth && displayHeight
                ? {
                    width: displayWidth,
                    height: displayHeight,
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                  }
                : { visibility: "hidden" }
            }
          />
        </div>

        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={handleZoomChange}
          className="mt-4 w-full accent-kreova-accent"
          aria-label="Zoom foto"
        />

        <div className="mt-5 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isProcessing}>
            Batal
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!naturalSize || isProcessing}>
            {isProcessing ? "Memproses..." : "Gunakan Foto"}
          </Button>
        </div>
      </div>
    </div>
  );
}
