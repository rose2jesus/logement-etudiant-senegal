'use server';

import { redirect } from 'next/navigation';
import { getSessionToken } from '@/lib/session';
import { apiFetch, ApiError } from '@/lib/api';

interface CreatePropertyPayload {
  title: string;
  description: string;
  type: string;
  cityId: string;
  neighborhoodId?: string;
  institutionId?: string;
  distanceKm?: number;
  price: number;
  pricePeriod: string;
  deposit?: number;
  furnished: boolean;
  capacity: number;
  minDurationMonths?: number;
  availableFrom?: string;
  features: string[];
  images: string[];
}

export async function createPropertyAction(
  payload: CreatePropertyPayload,
): Promise<{ error?: string }> {
  const token = getSessionToken();
  if (!token) return { error: 'Tu dois être connecté pour publier une annonce' };

  if (payload.images.length === 0) {
    return { error: 'Ajoute au moins une photo avant de publier' };
  }

  try {
    await apiFetch('/properties', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: 'Erreur lors de la publication, réessaie plus tard' };
  }

  redirect('/proprietaire/dashboard');
}
