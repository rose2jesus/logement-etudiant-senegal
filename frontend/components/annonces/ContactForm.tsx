'use client';

import { useFormState } from 'react-dom';
import { sendContactRequestAction, type ContactFormState } from '@/app/logement/[slug]/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ContactForm({ propertyId }: { propertyId: string }) {
  const [state, formAction] = useFormState<ContactFormState, FormData>(
    sendContactRequestAction,
    undefined,
  );
  const pending = false;

  if (state?.success) {
    return (
      <p className="rounded-button bg-success/10 p-4 text-sm text-success">
        Ta demande a bien été envoyée au propriétaire. Il te contactera directement.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="propertyId" value={propertyId} />
      <Input label="Ton nom" name="name" required />
      <Input label="Ton téléphone" name="phone" type="tel" required />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-900">Message (optionnel)</label>
        <textarea
          name="message"
          rows={3}
          className="rounded-button border border-gray-300 p-2.5"
          placeholder="Bonjour, je suis intéressé(e) par cette annonce..."
        />
      </div>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending}>{pending ? 'Envoi...' : 'Envoyer la demande'}</Button>
    </form>
  );
}
