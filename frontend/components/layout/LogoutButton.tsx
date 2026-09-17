'use client';

import { logoutAction } from './actions';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="text-neutral-500">Déconnexion</button>
    </form>
  );
}
