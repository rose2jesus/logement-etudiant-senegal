'use server';

import { revalidatePath } from 'next/cache';
import { getSessionToken } from '@/lib/session';
import { apiFetch } from '@/lib/api';

interface PromotionOrderResult {
  orderId: string;
  checkoutUrl: string | null;
  demoMode: boolean;
  message: string;
}

export async function createPromotionOrderAction(propertyId: string, promotionDays: number) {
  const token = getSessionToken();
  if (!token) return { error: 'Session expirée, reconnecte-toi.' };

  try {
    const order = await apiFetch<PromotionOrderResult>(`/payments/properties/${propertyId}/promotion`, {
      method: 'POST',
      token,
      body: JSON.stringify({ promotionDays }),
    });
    return order;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Impossible de créer la commande.' };
  }
}

export async function simulatePaymentAction(orderId: string) {
  const token = getSessionToken();
  if (!token) return { error: 'Session expirée, reconnecte-toi.' };
  try {
    await apiFetch(`/payments/${orderId}/simulate`, { method: 'POST', token });
    revalidatePath('/proprietaire/dashboard');
    return { simulated: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Échec de la simulation.' };
  }
}

export async function deletePropertyAction(propertyId: string) {
  const token = getSessionToken();
  if (!token) return;
  await apiFetch(`/properties/${propertyId}`, { method: 'DELETE', token });
  revalidatePath('/proprietaire/dashboard');
}
