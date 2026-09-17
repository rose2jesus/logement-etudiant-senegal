'use server';

import { revalidatePath } from 'next/cache';
import { getSessionToken } from '@/lib/session';
import { apiFetch } from '@/lib/api';

export async function approvePropertyAction(propertyId: string) {
  const token = getSessionToken();
  if (!token) return;
  await apiFetch(`/properties/${propertyId}/moderate`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status: 'approved' }),
  });
  revalidatePath('/admin/dashboard');
}

export async function rejectPropertyAction(propertyId: string, formData: FormData) {
  const token = getSessionToken();
  if (!token) return;
  const rejectionReason = String(formData.get('rejectionReason') || 'Non conforme');
  await apiFetch(`/properties/${propertyId}/moderate`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status: 'rejected', rejectionReason }),
  });
  revalidatePath('/admin/dashboard');
}
