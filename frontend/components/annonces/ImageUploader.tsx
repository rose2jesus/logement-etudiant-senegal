'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur d'upload");
        uploaded.push(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur d'upload");
      }
    }
    onChange([...images, ...uploaded]);
    setUploading(false);
  }

  return (
    <div>
      <label className="text-sm font-medium text-neutral-900">Photos</label>
      <div className="mt-1.5 grid grid-cols-3 gap-2">
        {images.map((url, i) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-button bg-gray-100">
            <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((u) => u !== url))}
              className="absolute right-1 top-1 rounded-full bg-white/90 px-1.5 text-xs text-danger"
              aria-label="Retirer cette photo"
            >
              ✕
            </button>
          </div>
        ))}
        <label className="flex aspect-square cursor-pointer items-center justify-center rounded-button border-2 border-dashed border-gray-300 text-sm text-neutral-500 hover:border-primary">
          {uploading ? '...' : '+ Ajouter'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
