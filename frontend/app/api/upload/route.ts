import { NextRequest, NextResponse } from 'next/server';
import { getSessionToken } from '@/lib/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Ce proxy existe car le token de session est stocké en cookie httpOnly
// (inaccessible en JS côté client) — seul le serveur Next.js peut le lire
// pour l'attacher à la requête vers le backend NestJS.
export async function POST(req: NextRequest) {
  const token = getSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const incomingFormData = await req.formData();
  const file = incomingFormData.get('file');
  if (!file) {
    return NextResponse.json({ message: 'Aucun fichier reçu' }, { status: 400 });
  }

  const outgoingFormData = new FormData();
  outgoingFormData.append('file', file);

  const res = await fetch(`${API_URL}/upload/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: outgoingFormData,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
