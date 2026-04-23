# CavePlus

MVP Next.js Pages Router base sur le PRD `docs/PRD_CavePlus.md`.

## Demarrage

```bash
npm install
npm run dev
```

## Scripts utiles

```bash
npm run build
npm run lint
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Notes

- Le projet utilise des donnees mockees pour le front tant que PostgreSQL, PayHubSecure et WaSender ne sont pas branches.
- Les routes API valident deja les entrees avec Zod.
- Le schema Prisma couvre auth, catalogue, commandes, CMS, audit et redirections SEO.
