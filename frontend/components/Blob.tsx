interface BlobProps {
  className?: string;
  color?: string;
}

// Forme organique (pas un simple cercle) — signature visuelle douce du style "Pinterest".
export function Blob({ className = '', color = 'currentColor' }: BlobProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill={color}>
      <path d="M45.3,-58.6C58.6,-49.5,69.2,-35.7,73.6,-19.9C78,-4.1,76.2,13.7,68.8,28.7C61.4,43.7,48.4,55.9,33.4,63.5C18.4,71.1,1.4,74.1,-15.9,72.1C-33.2,70.1,-50.8,63.1,-62.2,50.3C-73.6,37.5,-78.8,18.8,-77.5,0.9C-76.2,-17,-68.4,-34,-56.2,-43.8C-44,-53.6,-27.4,-56.2,-11.6,-59.7C4.2,-63.2,20.9,-67.7,45.3,-58.6Z" transform="translate(100 100)" />
    </svg>
  );
}
