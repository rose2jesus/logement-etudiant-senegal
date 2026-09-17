'use server';

import { revalidatePath } from 'next/cache';
import { getSessionToken } from '@/lib/session';
import { apiFetch } from '@/lib/api';

export async function removeFavoriteAction(propertyId: string) {
  const token = getSessionToken();
  if (!token) return;
  await apiFetch(`/favorites/${propertyId}`, { method: 'DELETE', token });
  revalidatePath('/etudiant/favoris');
}
