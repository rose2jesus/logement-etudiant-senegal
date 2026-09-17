// Transforme "Grand Dakar" en "grand-dakar", retire les accents
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Ajoute un suffixe aléatoire pour garantir l'unicité (utilisé pour les annonces)
export function slugifyWithSuffix(text: string): string {
  return `${slugify(text)}-${Math.random().toString(36).slice(2, 8)}`;
}
