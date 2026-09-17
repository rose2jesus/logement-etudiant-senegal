'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { registerAction, type FormState } from '../actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function InscriptionPage() {
  const [role, setRole] = useState<'student' | 'owner'>('student');
  const [state, formAction] = useFormState<FormState, FormData>(registerAction, undefined);
  const pending = false;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Créer mon compte</h1>

      {/* Bascule de rôle */}
      <div className="mb-6 flex rounded-button border border-gray-300 p-1">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`flex-1 rounded-button py-2 text-sm font-medium transition-colors ${
            role === 'student' ? 'bg-primary text-white' : 'text-neutral-500'
          }`}
        >
          Étudiant
        </button>
        <button
          type="button"
          onClick={() => setRole('owner')}
          className={`flex-1 rounded-button py-2 text-sm font-medium transition-colors ${
            role === 'owner' ? 'bg-primary text-white' : 'text-neutral-500'
          }`}
        >
          Propriétaire
        </button>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="role" value={role} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Prénom" name="firstName" required minLength={2} />
          <Input label="Nom" name="lastName" required minLength={2} />
        </div>
        <Input label="Email" name="email" type="email" required />
        <Input label="Téléphone" name="phone" type="tel" required placeholder="77 123 45 67" />

        {role === 'student' && (
          <>
            {/* NOTE: à remplacer par des <select> alimentés dynamiquement
                via GET /api/institutions et GET /api/cities (module cities/institutions,
                pas encore développé à ce stade du projet). Champs texte temporaires. */}
            <Input label="ID Établissement" name="institutionId" required />
            <Input label="ID Ville" name="cityId" required />
          </>
        )}

        <Input label="Mot de passe" name="password" type="password" required minLength={8} />

        {state?.error && (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? 'Création en cours...' : 'Créer mon compte'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Déjà inscrit ?{' '}
        <Link href="/connexion" className="font-medium text-primary">
          Se connecter
        </Link>
      </p>
    </main>
  );
}
