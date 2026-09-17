'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';
import { getSessionToken } from '@/lib/session';

export type ContactFormState = { success?: boolean; error?: string } | undefined;

export async function sendContactRequestAction(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    await apiFetch('/contact-requests', {
      method: 'POST',
      token: getSessionToken(),
      body: JSON.stringify({
        propertyId: formData.get('propertyId'),
        name: formData.get('name'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        channel: 'formulaire',
      }),
    });
    return { success: true };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : 'Erreur, réessaie plus tard' };
  }
}

export async function toggleFavoriteAction(propertyId: string, isFavorite: boolean) {
  const token = getSessionToken();
  if (!token) return { error: 'Connecte-toi pour ajouter un favori' };
  try {
    await apiFetch(`/favorites/${propertyId}`, { method: isFavorite ? 'DELETE' : 'POST', token });
    revalidatePath('/logement');
    return { success: true };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : 'Erreur' };
  }
}

export async function reportPropertyAction(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    await apiFetch('/reports', {
      method: 'POST',
      token: getSessionToken(),
      body: JSON.stringify({
        propertyId: formData.get('propertyId'),
        reason: formData.get('reason'),
        description: formData.get('description'),
      }),
    });
    return { success: true };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : 'Erreur, réessaie plus tard' };
  }
}
