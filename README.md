# Logement Étudiant Sénégal — Guide d'installation et de test

Plateforme complète de mise en relation étudiants/propriétaires pour le logement étudiant au Sénégal.

## Structure du projet

```
logement-etudiant-senegal/
├── backend/     # API NestJS + Prisma + PostgreSQL (Supabase)
└── frontend/    # Next.js 14 + Tailwind CSS
```

---

## 1. Installation

### a) Créer un projet Supabase (base de données gratuite)

1. Va sur https://supabase.com → **New project**
2. Une fois créé, va dans **Project Settings > Database > Connection string**, onglet **URI**, copie l'adresse (idéalement le mode "Transaction pooler")

### b) Configurer et lancer le backend

```bash
cd backend
npm install
cp .env.example .env
```

Ouvre `.env` et remplis :
- `DATABASE_URL` → l'URI Supabase copiée à l'étape précédente
- `JWT_SECRET` → une chaîne aléatoire longue, ex. génère-la avec `openssl rand -base64 32`
- Laisse les champs `CLOUDINARY_*` vides pour l'instant (nécessaires uniquement pour l'upload de nouvelles photos — voir section 5)

Applique le schéma à la base de données **et génère le client Prisma** :
```bash
npx prisma migrate dev --name init
```

Charge les données de démonstration (villes, établissements, comptes de test, annonces) :
```bash
npm run prisma:seed
```

Démarre le serveur :
```bash
npm run start:dev
```
Tu dois voir : `Backend démarré sur http://localhost:3001/api`

### c) Configurer et lancer le frontend

Dans un **second terminal** :
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Ouvre `http://localhost:3000`.

---

## 2. Comptes de test créés par le seed

| Rôle | Email | Mot de passe |
|---|---|---|
| Étudiant | `etudiant-demo@test.sn` | `demo12345` |
| Propriétaire | `proprietaire-demo@test.sn` | `demo12345` |
| Admin | `admin@test.sn` | `demo12345` |

Le seed crée aussi : 3 villes (Dakar, Thiès, Kaolack), des quartiers, 2 établissements (UCAD, ESP), 3 annonces déjà **approuvées** et visibles publiquement, et 1 annonce **en attente** pour tester la modération.

---

## 3. Parcours de test recommandé

### Parcours étudiant (recherche → contact → favoris)

1. Va sur `/` → tu dois voir la page d'accueil avec les 3 annonces de démo dans "Logements recommandés"
2. Clique **Rechercher un logement** → teste les filtres (type, prix, meublé) et le tri
3. Clique sur une annonce → vérifie la page détail (photos, description, équipements, conditions)
4. Connecte-toi avec `etudiant-demo@test.sn` / `demo12345`
5. Retourne sur une annonce → clique **♡ Ajouter aux favoris** → va sur `/etudiant/favoris` → l'annonce doit y apparaître
6. Sur une annonce, remplis le **formulaire de contact** → la demande doit être enregistrée (vérifiable côté propriétaire, voir plus bas)
7. Teste le bouton **⚑ Signaler** → choisis un motif → confirme l'envoi

### Parcours propriétaire (publication → modération → demandes reçues)

1. Connecte-toi avec `proprietaire-demo@test.sn` / `demo12345` → tu arrives sur `/proprietaire/dashboard`
2. Vérifie les 3 annonces existantes avec leurs statuts (Active/En attente)
3. Clique **+ Nouvelle annonce** → remplis le formulaire complet
   - **Photos** : l'upload nécessite Cloudinary configuré (voir section 5) — sans ça, tu peux quand même tester le reste du formulaire, l'upload renverra une erreur claire
4. Soumets → la nouvelle annonce doit apparaître dans le dashboard avec le statut **En attente**
5. La demande de contact envoyée par l'étudiant à l'étape précédente est comptabilisée dans "Demandes reçues" (visible en détail via l'API `GET /api/contact-requests/received`, pas encore affichée en détail dans l'interface — voir section 6)

### Parcours admin (modération)

1. Connecte-toi avec `admin@test.sn` / `demo12345` → tu arrives sur `/admin/dashboard`
2. Vérifie les statistiques globales (utilisateurs, annonces, en attente, signalements)
3. Dans "Annonces en attente", tu dois voir l'annonce de Kaolack créée par le seed **et** celle que tu as éventuellement publiée à l'étape propriétaire
4. Clique **✓ Approuver** sur une annonce → retourne sur `/recherche` → elle doit maintenant apparaître publiquement
5. Teste aussi **✗ Rejeter** avec un motif sur une autre annonce → reconnecte-toi en propriétaire → le motif de rejet doit s'afficher dans le dashboard

### Vérifier la sécurité des accès

- Déconnecte-toi, essaie d'accéder directement à `/admin/dashboard` → tu dois être redirigé vers `/connexion`
- Connecté en tant qu'étudiant, essaie d'accéder à `/proprietaire/dashboard` → tu dois être redirigé vers `/` (contrôle de rôle)
- Essaie de créer un second compte avec le même email → le backend doit renvoyer une erreur claire

---

## 4. Tester l'API directement (sans interface)

```bash
# Recherche d'annonces avec filtres
curl "http://localhost:3001/api/properties?cityId=<ID_DAKAR>&maxPrice=50000&sort=price_asc"

# Connexion
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"etudiant-demo@test.sn","password":"demo12345"}'

# Stats admin (remplace TOKEN par l'accessToken reçu avec le compte admin)
curl http://localhost:3001/api/admin/stats -H "Authorization: Bearer TOKEN"
```

Utilise `npx prisma studio` (depuis `backend/`) pour visualiser/modifier directement les données en base via une interface graphique sur `http://localhost:5555`.

---

## 5. Activer l'upload de photos (Cloudinary)

1. Crée un compte gratuit sur https://cloudinary.com
2. Dans le Dashboard, récupère **Cloud Name**, **API Key**, **API Secret**
3. Renseigne-les dans `backend/.env`
4. Redémarre le backend (`npm run start:dev`)
5. Le formulaire "Nouvelle annonce" pourra alors uploader de vraies photos (compressées/redimensionnées automatiquement)

---

## 6. Limites connues (non implémenté à ce stade)

Conformément à la règle "indiquer clairement ce qui n'est pas encore implémenté" :

- **Messagerie interne temps réel** : volontairement exclue du MVP (choix validé en étape 2), remplacée par WhatsApp + formulaire de contact tracé en base
- **Modification d'une annonce existante** : le propriétaire peut seulement créer ou supprimer, pas encore éditer — à ajouter en prochaine itération
- **Affichage détaillé des demandes de contact reçues** dans le dashboard propriétaire (actuellement seul le compteur est affiché ; le détail est accessible via l'API `/api/contact-requests/received`)
- **Gestion des signalements** côté interface admin (accessible seulement via l'API `/api/reports` pour l'instant)
- **Paiement en ligne** (Wave, Orange Money...) : architecture prévue mais non développée, conformément au cahier des charges (pas de paiement obligatoire au lancement)
- **Carte interactive** (Leaflet/OpenStreetMap) : la localisation approximative est affichée en texte, pas encore sur une carte
- **Annonces premium/sponsorisées** : modèle économique documenté (étape 2) mais non développé
- **Gestion dynamique des quartiers** dans le formulaire de publication : le champ `neighborhoodId` existe en base mais n'est pas encore relié à un sélecteur dans le formulaire (actuellement laissé vide à la création)

## 7. Erreurs possibles

| Erreur | Cause | Solution |
|---|---|---|
| `Can't reach database server` | `DATABASE_URL` incorrect ou projet Supabase en pause | Vérifie `.env`, réveille le projet dans le dashboard Supabase |
| `UserRole has no exported member` (TypeScript) | Client Prisma non généré | `npx prisma generate` (fait automatiquement par `migrate dev`) |
| Erreur 401 sur toutes les routes protégées | `JWT_SECRET` vide ou cookie expiré | Vérifie `.env`, reconnecte-toi |
| Upload de photo échoue | Cloudinary non configuré | Voir section 5, ou teste le formulaire sans photo pour valider le reste |
| 404 sur une page dashboard après connexion | Rôle du compte ne correspond pas à la page visitée | Utilise le bon compte de test (voir section 2) |
| Page blanche / erreur Tailwind au premier lancement | Classes CSS pas encore compilées | Redémarre `npm run dev` |

---

## Prochaines étapes suggérées

Par ordre de priorité pour une v2 : édition d'annonce, interface admin pour les signalements, sélecteur de quartier dans le formulaire, carte interactive, puis passage aux fonctionnalités de monétisation (annonces premium) une fois une base d'utilisateurs réelle établie.
