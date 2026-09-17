'use server';

import { revalidatePath } from 'next/cache';
import { getSessionToken } from '@/lib/session';
import { apiFetch } from '@/lib/api';

export async function updateReportStatusAction(reportId: string, status: string) {
  const token = getSessionToken();
  if (!token) return;
  await apiFetch(`/reports/${reportId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  });
  revalidatePath('/admin/signalements');
}

// Action combinée : suspend l'annonce visée par le signalement ET marque le signalement comme traité.
export async function suspendReportedPropertyAction(reportId: string, propertyId: string) {
  const token = getSessionToken();
  if (!token) return;
  await apiFetch(`/properties/${propertyId}/moderate`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status: 'suspended' }),
  });
  await apiFetch(`/reports/${reportId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status: 'action_taken' }),
  });
  revalidatePath('/admin/signalements');
  revalidatePath('/admin/dashboard');
}
