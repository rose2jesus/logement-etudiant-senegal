'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { loginAction, type FormState } from '../actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ConnexionPage({ searchParams }: { searchParams: { redirect?: string } }) {
  const [state, formAction] = useFormState<FormState, FormData>(loginAction, undefined);
  const pending = false;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Connexion</h1>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="redirect" value={searchParams.redirect ?? ''} />
        <Input label="Email" name="email" type="email" required />
        <Input label="Mot de passe" name="password" type="password" required />

        {state?.error && (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="font-medium text-primary">
          S&apos;inscrire
        </Link>
      </p>
    </main>
  );
}
