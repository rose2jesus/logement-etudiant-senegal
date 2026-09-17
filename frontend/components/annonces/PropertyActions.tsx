'use client';

import { useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { toggleFavoriteAction, reportPropertyAction, type ContactFormState } from '@/app/logement/[slug]/actions';

const REASONS = [
  ['fausse_annonce', 'Fausse annonce'],
  ['prix_trompeur', 'Prix trompeur'],
  ['photos_trompeuses', 'Photos trompeuses'],
  ['logement_inexistant', 'Logement inexistant'],
  ['contenu_inapproprie', 'Contenu inapproprié'],
  ['arnaque', "Tentative d'arnaque"],
  ['autre', 'Autre'],
];

export function PropertyActions({ propertyId, isLoggedIn }: { propertyId: string; isLoggedIn: boolean }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favError, setFavError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [pending, startTransition] = useTransition();
  const [reportState, reportAction] = useFormState<ContactFormState, FormData>(
    reportPropertyAction,
    undefined,
  );
  const reportPending = false;

  function handleFavorite() {
    if (!isLoggedIn) { setFavError('Connecte-toi pour ajouter un favori'); return; }
    startTransition(async () => {
      const result = await toggleFavoriteAction(propertyId, isFavorite);
      if (result?.error) setFavError(result.error);
      else setIsFavorite(!isFavorite);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={handleFavorite}
          disabled={pending}
          className="flex-1 rounded-button border border-gray-300 py-2.5 text-sm font-medium text-neutral-900"
        >
          {isFavorite ? '♥ Dans mes favoris' : '♡ Ajouter aux favoris'}
        </button>
        <button
          onClick={() => setShowReport((v) => !v)}
          className="rounded-button border border-gray-300 px-3 py-2.5 text-sm text-danger"
        >
          ⚑ Signaler
        </button>
      </div>
      {favError && <p className="text-xs text-danger">{favError}</p>}

      {showReport && (
        <>
          {reportState?.success ? (
            <p className="rounded-button bg-success/10 p-3 text-sm text-success">
              Signalement envoyé, merci de nous aider à garder la plateforme fiable.
            </p>
          ) : (
            <form action={reportAction} className="flex flex-col gap-2 rounded-button border border-gray-200 p-3">
              <input type="hidden" name="propertyId" value={propertyId} />
              <select name="reason" required className="rounded-button border border-gray-300 p-2 text-sm">
                {REASONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <textarea
                name="description"
                rows={2}
                placeholder="Détails (optionnel)"
                className="rounded-button border border-gray-300 p-2 text-sm"
              />
              {reportState?.error && <p className="text-xs text-danger">{reportState.error}</p>}
              <button
                type="submit"
                disabled={reportPending}
                className="rounded-button bg-danger py-2 text-sm font-medium text-white"
              >
                {reportPending ? 'Envoi...' : 'Envoyer le signalement'}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
