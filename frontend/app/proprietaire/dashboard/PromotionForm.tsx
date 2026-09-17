'use client';

import { useState } from 'react';
import { createPromotionOrderAction, simulatePaymentAction } from './actions';
import { SparklesIcon } from '@/components/icons';

interface PromotionFormProps {
  propertyId: string;
  promotedUntil?: string | null;
}

export function PromotionForm({ propertyId, promotedUntil }: PromotionFormProps) {
  const provider = 'wave' as const;
  const [days, setDays] = useState('7');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const isCurrentlyPromoted = promotedUntil && new Date(promotedUntil) > new Date();

  async function submit() {
    setPending(true);
    setMessage('');
    setPendingOrderId(null);
    const result = await createPromotionOrderAction(propertyId, provider, Number(days));

    if ('error' in result) {
      setMessage(result.error!);
    } else if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl; // vrai paiement configuré
    } else {
      setMessage(result.message);
      setPendingOrderId(result.orderId); // mode démo : propose de simuler
    }
    setPending(false);
  }

  async function simulate() {
    if (!pendingOrderId) return;
    setPending(true);
    const result = await simulatePaymentAction(pendingOrderId);
    if ('error' in result) setMessage(result.error!);
    else setMessage('✅ Paiement simulé, annonce mise en avant.');
    setPendingOrderId(null);
    setPending(false);
  }

  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium text-secondary">
        <SparklesIcon className="h-3.5 w-3.5" />
        {isCurrentlyPromoted
          ? `Sponsorisée jusqu'au ${new Date(promotedUntil!).toLocaleDateString('fr-FR')}`
          : 'Mettre en avant · 1 000 FCFA / jour'}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-button border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-900">
          💳 Wave
        </span>
        <select
          value={days}
          onChange={(event) => setDays(event.target.value)}
          className="rounded-button border border-neutral-200 bg-white px-2.5 py-1.5 text-xs"
          aria-label="Durée de la promotion"
        >
          <option value="3">3 jours · 3 000 FCFA</option>
          <option value="7">7 jours · 7 000 FCFA</option>
          <option value="14">14 jours · 14 000 FCFA</option>
          <option value="30">30 jours · 30 000 FCFA</option>
        </select>
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-button bg-secondary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
        >
          {pending ? '...' : isCurrentlyPromoted ? 'Prolonger' : 'Continuer'}
        </button>
      </div>

      {message && <p className="mt-2 text-xs text-neutral-500">{message}</p>}

      {pendingOrderId && (
        <button
          type="button"
          onClick={simulate}
          disabled={pending}
          className="mt-2 rounded-button border border-dashed border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:border-primary hover:text-primary"
        >
          🧪 Simuler le paiement (mode démo, pas de compte marchand configuré)
        </button>
      )}
    </div>
  );
}
