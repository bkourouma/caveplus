# PRD — CavePlus

> **E-commerce de vins, spiritueux & bières — Plateforme premium + back-office + automatisations WhatsApp**
> Document destiné à **Cursor AI**
> Stack : Next.js (Pages Router) · PostgreSQL · Prisma · UploadThing
> Version 1.0 — Avril 2026

---

## Table des matières

1. [Executive Summary](#1-executive-summary)
2. [Stack technique & architecture](#2-stack-technique--architecture)
3. [Design system](#3-design-system)
4. [Modèle de données (Prisma)](#4-modèle-de-données-prisma)
5. [Fonctionnalités — Front public](#5-fonctionnalités--front-public)
6. [Checkout & intégration PayHubSecure](#6-checkout--intégration-payhubsecure)
7. [Module WhatsApp (WaSender)](#7-module-whatsapp-wasender)
8. [Back-office admin](#8-back-office-admin)
9. [Sécurité, performance & qualité](#9-sécurité-performance--qualité)
10. [SEO & visibilité](#10-seo--visibilité)
11. [Roadmap](#11-roadmap)
12. [Instructions pour Cursor AI](#12-instructions-pour-cursor-ai)

---

## 1. Executive Summary

### 1.1 Contexte

Il s'agit de reconstruire une plateforme e-commerce premium de vente de vins, spiritueux, bières et accessoires, avec un positionnement **luxe** (inspiration cave haut de gamme). La plateforme cible le marché ivoirien (devise **FCFA**, langue **fr-FR**) et intègre nativement les usages locaux : paiement mobile money via **PayHubSecure** et communication client via **WhatsApp**.

Le projet remplace une solution existante construite sur Supabase/Lovable par une architecture plus robuste, maintenable et évolutive basée sur **Next.js + PostgreSQL + Prisma**.

### 1.2 Objectifs produit

- Offrir une expérience d'achat **mobile-first** irréprochable (la majorité du trafic local est mobile).
- Permettre l'authentification rapide via **Google OAuth** ou **email/mot de passe**.
- Encaisser des paiements en ligne via **PayHubSecure** (mobile money + carte).
- Automatiser la communication transactionnelle WhatsApp (confirmations, mises à jour de commande).
- Offrir un canal marketing WhatsApp direct (broadcast, annonces, promos).
- Fournir un back-office complet permettant à une équipe non-technique de gérer produits, commandes, textes du site, clients et communications.

### 1.3 Principes directeurs non négociables

- **Mobile-first** : chaque écran est conçu d'abord pour mobile (360–414px). Desktop est une progressive enhancement.
- **Design luxe moderne** : palette or / bordeaux / crème / charbon, typo display pour titres, respirations généreuses, micro-animations subtiles.
- **Performance** : LCP < 2.5s sur 4G, Lighthouse Perf ≥ 90 mobile.
- **Robustesse** : gestion d'erreurs visible, aucune transaction silencieuse, idempotence des webhooks.
- **Accessibilité** : WCAG AA minimum (contraste, focus visible, navigation clavier).

---

## 2. Stack technique & architecture

### 2.1 Stack imposé

| Couche | Choix | Justification |
|---|---|---|
| Framework | **Next.js 14 (Pages Router)** | SSR/ISR, API routes intégrées, déploiement Vercel natif |
| Langage | **TypeScript strict** | Sécurité de type sur toute la stack |
| Styling | **Tailwind CSS + shadcn/ui** | Utility-first rapide + composants accessibles |
| Base de données | **PostgreSQL 15+** | Relations complexes, transactions ACID |
| ORM | **Prisma** | Migrations versionnées, type-safety bout-à-bout |
| Auth | **NextAuth.js (Auth.js)** | Support natif Google OAuth + Credentials |
| Upload images | **UploadThing** | Intégration Next.js native, CDN inclus |
| Paiement | **PayHubSecure** | Mobile Money CI + carte Visa |
| WhatsApp | **WaSender API** | Provider déjà éprouvé |
| Email transactionnel | **Resend** ou Postmark | Délivrabilité élevée |
| Hébergement | **Vercel** + Neon / Supabase Postgres | Scaling auto, free tier généreux |
| Monitoring | **Sentry + Vercel Analytics** | Erreurs + Web Vitals |

### 2.2 Architecture haut niveau

```
┌─────────────────────────────────────────────────────────────┐
│                 NAVIGATEUR (Mobile-first)                   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────┐
│            NEXT.JS APP (Pages Router) — Vercel              │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ Pages public  │  │  Pages admin  │  │   /api/*        │  │
│  │ (SSR + ISR)   │  │ (SSR + auth)  │  │  REST handlers  │  │
│  └───────────────┘  └───────────────┘  └────────┬────────┘  │
└─────────────────────────────────────────────────┼───────────┘
                                                  │
       ┌──────────────┬──────────────┬────────────┼──────────┬──────────┐
       ▼              ▼              ▼            ▼          ▼          ▼
  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌────────┐ ┌────────┐
  │ Postgres │  │UploadThing │  │PayHubSec.│  │WaSender│ │ Resend │
  │ + Prisma │  │   (CDN)    │  │(paiement)│  │(WhatsA)│ │(email) │
  └──────────┘  └────────────┘  └──────────┘  └────────┘ └────────┘
```

### 2.3 Structure de dossiers Next.js (Pages Router)

```
caveplus/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   └── assets/
├── src/
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx                  # Accueil
│   │   ├── catalogue.tsx
│   │   ├── categorie/[slug].tsx
│   │   ├── produit/[slug].tsx
│   │   ├── panier.tsx
│   │   ├── checkout.tsx
│   │   ├── checkout/retour.tsx        # Url_Retour PayHub
│   │   ├── a-propos.tsx
│   │   ├── localisation.tsx
│   │   ├── compte/
│   │   │   ├── index.tsx
│   │   │   ├── commandes.tsx
│   │   │   └── profil.tsx
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── inscription.tsx
│   │   ├── admin/
│   │   │   ├── index.tsx              # Dashboard
│   │   │   ├── produits/
│   │   │   ├── categories/
│   │   │   ├── commandes/
│   │   │   ├── stocks/
│   │   │   ├── clients/
│   │   │   ├── whatsapp/
│   │   │   ├── cms/
│   │   │   ├── statistiques.tsx
│   │   │   └── parametres.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth].ts
│   │       ├── products/
│   │       ├── cart/
│   │       ├── orders/
│   │       ├── checkout/
│   │       │   ├── create-payment.ts  # appelle PayHub
│   │       │   └── ipn.ts             # callback PayHub
│   │       ├── uploadthing.ts
│   │       ├── whatsapp/
│   │       │   ├── send.ts
│   │       │   ├── broadcast.ts
│   │       │   └── webhook.ts
│   │       └── admin/
│   ├── components/
│   │   ├── ui/           # shadcn
│   │   ├── layout/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── admin/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── payhub.ts
│   │   ├── wasender.ts
│   │   ├── uploadthing.ts
│   │   ├── email.ts
│   │   └── utils/
│   ├── hooks/
│   ├── styles/globals.css
│   └── types/
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Design system

### 3.1 Direction artistique

Inspiration : cave à vins de prestige, bijouterie haut de gamme, hôtel de luxe. Le design doit évoquer le soin, l'expertise et la rareté — sans être ostentatoire. Chaque produit doit être mis en scène comme une pièce précieuse.

### 3.2 Palette de couleurs

| Token Tailwind | HEX | Usage |
|---|---|---|
| `gold` / `--gold` | `#D4AF37` | Accents, boutons primaires, prix, séparateurs |
| `bordeaux` / `--bordeaux` | `#7B1E3A` | Titres hero, CTA forts, badges promo |
| `cream` / `--cream` | `#F7F2E9` | Fond principal, cartes |
| `charcoal` / `--charcoal` | `#1F2937` | Texte principal, footer |
| `ink` / `--ink` | `#0B0B0B` | Texte fort, overlays |
| `mist` / `--mist` | `#E8E4DB` | Bordures, dividers, skeletons |
| `success` | `#2F855A` | Stock disponible, paiement validé |
| `warning` | `#C05621` | Stock faible, en attente |
| `error` | `#9B2C2C` | Rupture, erreur paiement |

### 3.3 Typographie

- **Display (titres)** : Outfit — 600/700, tracking serré, pour les hero et noms de produits.
- **Body (UI & contenu)** : Inter — 400/500, pour la lecture courante, formulaires, listes.
- **Échelle mobile** : 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48px. Pas de titre > 48px sur mobile.
- **Line-height** : 1.25 pour titres, 1.6 pour body. Tracking titres display : `-0.02em`.

### 3.4 Spacing, radius, shadows, motion

- **Spacing scale** : 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 (multiples de 4).
- **Radius** : 6px (inputs, petits boutons), 12px (cartes produits), 20px (modales).
- **Shadows** : très discrètes, jamais de drop-shadow marqué. Préférer bordures 1px `#E8E4DB`.
- **Motion** : durations 150-250ms, easing `ease-out`. Respecter `prefers-reduced-motion`.

### 3.5 Grille & breakpoints (mobile-first)

| Breakpoint | Largeur | Gouttières | Colonnes | Usage |
|---|---|---|---|---|
| base (mobile) | < 640px | 16px | 1-2 | **Design par défaut, priorité absolue** |
| sm | ≥ 640px | 20px | 2 | Grands mobiles, petits tablets |
| md | ≥ 768px | 24px | 2-3 | Tablets |
| lg | ≥ 1024px | 32px | 3-4 | Laptops |
| xl | ≥ 1280px | 40px | 4 | Desktop |

### 3.6 Composants UI clés

- **Boutons** : primaire (fond gold, texte charcoal), secondaire (outline gold), ghost, danger. Taille min tap target 44×44px.
- **Inputs** : 48px de hauteur sur mobile, label au-dessus, erreur en rouge sous l'input.
- **Cards produit** : image 4:5, titre display, prix en gold, badge catégorie en haut-gauche, bouton ajout panier en bas.
- **Bottom nav mobile** : accueil / catalogue / panier (badge) / compte — fixée en bas, icônes + labels.
- **Drawer panier** : slide-in depuis la droite, 90vw max sur mobile, 420px sur desktop.
- **Toasts** : sonner (shadcn), positionnés en haut sur mobile.
- **Skeletons** : pour chaque liste (produits, commandes), pas de spinner full-screen.

---

## 4. Modèle de données (Prisma)

Le schéma suivant est le **point de départ canonique**. Cursor peut l'étendre mais ne doit pas en casser la cohérence sans justification.

### 4.1 Schema Prisma

```prisma
// prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

// ===== AUTH (NextAuth) =====
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  emailVerified  DateTime?
  name           String?
  image          String?
  passwordHash   String?   // null si OAuth only
  phone          String?
  role           Role      @default(CUSTOMER)
  whatsappOptIn  Boolean   @default(false)
  accounts       Account[]
  sessions       Session[]
  addresses      Address[]
  orders         Order[]
  cart           Cart?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

enum Role { CUSTOMER ADMIN STAFF }

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

// ===== CATALOGUE =====
model Category {
  id          String     @id @default(cuid())
  slug        String     @unique
  name        String
  description String?
  imageUrl    String?
  parentId    String?
  parent      Category?  @relation("CatTree", fields: [parentId], references: [id])
  children    Category[] @relation("CatTree")
  products    Product[]
  sortOrder   Int        @default(0)
  isVisible   Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Product {
  id             String          @id @default(cuid())
  slug           String          @unique
  name           String
  shortDesc      String?
  description    String?         @db.Text
  price          Int             // FCFA, entier
  compareAtPrice Int?            // prix barré
  sku            String?         @unique
  stock          Int             @default(0)
  lowStockAlert  Int             @default(5)
  weightG        Int?
  volumeMl       Int?
  alcoholPct     Float?
  origin         String?
  vintage        Int?
  producer       String?
  categoryId     String
  category       Category        @relation(fields: [categoryId], references: [id])
  images         ProductImage[]
  isActive       Boolean         @default(true)
  isFeatured     Boolean         @default(false)
  orderItems     OrderItem[]
  cartItems      CartItem[]
  stockMoves     StockMovement[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  @@index([categoryId, isActive])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  url       String
  alt       String?
  sortOrder Int     @default(0)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

// ===== CART & ORDERS =====
model Cart {
  id        String     @id @default(cuid())
  userId    String?    @unique
  sessionId String?    @unique // panier invité
  user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  productId String
  qty       Int
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])
  @@unique([cartId, productId])
}

model Address {
  id         String  @id @default(cuid())
  userId     String
  label      String?
  fullName   String
  phone      String
  line1      String
  line2      String?
  city       String
  country    String  @default("CI")
  zone       String? // zone de livraison
  isDefault  Boolean @default(false)
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model DeliveryZone {
  id        String  @id @default(cuid())
  name      String  @unique
  fee       Int     // FCFA
  etaHours  Int?
  isActive  Boolean @default(true)
  orders    Order[]
}

model Order {
  id             String         @id @default(cuid())
  code           String         @unique // ex: CP-20260418-0001
  userId         String?
  customerEmail  String
  customerPhone  String
  customerName   String
  items          OrderItem[]
  subtotal       Int
  deliveryFee    Int
  total          Int
  status         OrderStatus    @default(PENDING)
  paymentStatus  PaymentStatus  @default(PENDING)
  paymentRef     String?        // tokens PayHub
  paymentTxnId   String?        // referencePaiement reçue dans IPN
  paymentMethod  String?        // ex: "MTN Money", "Visa"
  deliveryZoneId String?
  deliveryZone   DeliveryZone?  @relation(fields: [deliveryZoneId], references: [id])
  shippingAddr   Json           // snapshot
  notes          String?
  user           User?          @relation(fields: [userId], references: [id])
  events         OrderEvent[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  @@index([status, createdAt])
  @@index([paymentStatus])
}

enum OrderStatus { PENDING CONFIRMED PREPARING SHIPPED DELIVERED CANCELLED REFUNDED }
enum PaymentStatus { PENDING PROCESSING PAID FAILED REFUNDED }

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  productId   String
  productName String  // snapshot
  unitPrice   Int     // snapshot
  qty         Int
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product @relation(fields: [productId], references: [id])
}

model OrderEvent {
  id        String   @id @default(cuid())
  orderId   String
  type      String   // CREATED, PAID, STATUS_CHANGED, WHATSAPP_SENT...
  message   String?
  metadata  Json?
  createdAt DateTime @default(now())
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model StockMovement {
  id        String   @id @default(cuid())
  productId String
  delta     Int      // + entrée, - sortie
  reason    String   // ORDER, MANUAL_ADJUSTMENT, RETURN...
  refId     String?  // ex: orderId
  userId    String?  // admin qui a fait le mouvement
  createdAt DateTime @default(now())
  product   Product  @relation(fields: [productId], references: [id])
}

// ===== WHATSAPP =====
model WhatsappCampaign {
  id          String   @id @default(cuid())
  name        String
  message     String   @db.Text
  imageUrl    String?
  status      String   @default("DRAFT") // DRAFT, SCHEDULED, SENDING, SENT, FAILED
  scheduledAt DateTime?
  sentAt      DateTime?
  targetKind  String   // ALL_CUSTOMERS, OPTED_IN, SEGMENT, CUSTOM_LIST
  segmentJson Json?
  createdById String
  createdAt   DateTime @default(now())
  sends       WhatsappSend[]
}

model WhatsappSend {
  id         String   @id @default(cuid())
  campaignId String?
  toPhone    String
  toUserId   String?
  message    String   @db.Text
  status     String   // QUEUED, SENT, DELIVERED, FAILED
  error      String?
  sentAt     DateTime?
  campaign   WhatsappCampaign? @relation(fields: [campaignId], references: [id])
  createdAt  DateTime @default(now())
  @@index([toPhone])
}

// ===== CMS =====
model CmsBlock {
  id        String   @id @default(cuid())
  key       String   @unique // ex: "home.hero.title"
  label     String
  type      String   // TEXT, RICHTEXT, IMAGE, JSON
  value     String   @db.Text
  updatedAt DateTime @updatedAt
}

model CmsPage {
  id          String   @id @default(cuid())
  slug        String   @unique // ex: "a-propos"
  title       String
  body        String   @db.Text // markdown
  isPublished Boolean  @default(true)
  updatedAt   DateTime @updatedAt
}

// ===== SETTINGS & AUDIT =====
model Setting {
  key   String @id
  value String @db.Text // JSON stringifié
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  entity    String?
  entityId  String?
  metadata  Json?
  ip        String?
  createdAt DateTime @default(now())
  @@index([entity, entityId])
  @@index([userId, createdAt])
}
```

---

## 5. Fonctionnalités — Front public

### 5.1 Routes publiques

| Route | Rôle |
|---|---|
| `/` | Accueil : hero, catégories phares, produits vedettes, nouveautés, bandeau confiance |
| `/catalogue` | Liste complète + filtres (catégorie, prix, origine, disponibilité) + tri |
| `/categorie/[slug]` | Liste filtrée par catégorie |
| `/produit/[slug]` | Fiche produit détaillée |
| `/panier` | Récapitulatif panier, ajustement quantités, code promo |
| `/checkout` | Adresse + livraison + paiement |
| `/checkout/retour` | Page de retour PayHub (affiche statut) |
| `/a-propos` | Page contenu CMS |
| `/localisation` | Adresse boutique physique + Google Maps embed |
| `/compte` | Dashboard client |
| `/compte/commandes` | Historique commandes + suivi |
| `/compte/profil` | Informations perso, opt-in WhatsApp, adresses |
| `/auth/login` | Login Google + email/password |
| `/auth/inscription` | Inscription email/password |

### 5.2 Spec — Page d'accueil (mobile-first)

**Sections (de haut en bas sur mobile)** :

1. **Header sticky** : logo centré, icône hamburger à gauche, icônes recherche et panier à droite.
2. **Hero** : image plein écran d'une cave, titre display bordeaux sur overlay crème, CTA gold « Explorer le catalogue ».
3. **Carrousel catégories** : cartes rondes avec image + nom (vins, champagnes, whiskies, cognacs, bières, accessoires).
4. **Produits vedettes** : scroll horizontal sur mobile, grille 4 colonnes sur desktop.
5. **Bandeau confiance** : livraison Abidjan, paiement sécurisé, produits authentiques (3 icônes + textes courts).
6. **Nouveautés** : même pattern que vedettes.
7. **Bloc éditorial** : photo + texte court « Notre sélection du mois » (géré depuis CMS).
8. **Footer** : liens, réseaux, newsletter WhatsApp opt-in, mentions.

### 5.3 Spec — Fiche produit

- **Galerie** : image principale 4:5 en haut, miniatures swipeables (mobile) ou en colonne (desktop). Zoom au tap/clic.
- **Infos principales** : nom display, producteur (petit), prix en gold grand format, prix barré si promo, badge stock.
- **Sélecteur quantité + bouton « Ajouter au panier »** gold pleine largeur sur mobile, sticky en bas jusqu'au clic.
- **Accordéons** : Description / Caractéristiques (volume, alcool, origine, millésime) / Livraison & retours.
- **Bloc produits similaires** en bas.
- **Partage WhatsApp** direct (lien `wa.me` préformaté).

### 5.4 Shopping cart avancé

**Exigences fonctionnelles** :

- **Panier persistant** : pour les invités via cookie `sessionId` ; pour les users connectés via DB. Fusion automatique à la connexion.
- **Ajout depuis n'importe quelle liste produit** → feedback visuel (toast + badge panier animé).
- **Drawer panier** accessible depuis toutes les pages (icône header + bottom nav sur mobile).
- **Actions inline** : +/- quantité avec debounce 400ms, suppression avec undo 5s, édition directe de la qty.
- **Vérification stock en temps réel** : si qty demandée > stock, cap automatique avec message clair.
- **Prix recalculés côté serveur** à chaque mutation (source de vérité = DB, jamais le client).
- **Codes promo** : input dans `/panier`, validation serveur, types gérés : pourcentage, montant fixe, livraison offerte.
- **Estimation frais livraison** dès le panier dès que l'utilisateur sélectionne une zone.
- **Wishlist** : bouton cœur sur fiche produit (auth requise).
- **Abandon panier** : après 24h pour user connecté avec opt-in WhatsApp → message de relance.

**Endpoints API** :

| Méthode | Route | Rôle |
|---|---|---|
| `GET` | `/api/cart` | Récupère le panier courant (user ou sessionId) |
| `POST` | `/api/cart/items` | Ajoute un item `{ productId, qty }` |
| `PATCH` | `/api/cart/items/[id]` | Modifie la quantité |
| `DELETE` | `/api/cart/items/[id]` | Supprime un item |
| `POST` | `/api/cart/merge` | Fusionne panier invité → panier user après login |
| `POST` | `/api/cart/promo` | Applique un code promo |

### 5.5 Authentification

**Méthodes supportées** :

- **Google OAuth** via NextAuth (scopes : `email`, `profile`). Création/liaison du User automatique par email.
- **Email + mot de passe** (Credentials provider NextAuth). Hash bcrypt (min 10 rounds).
- **Vérification email** obligatoire pour Credentials : envoi d'un magic link à l'inscription.
- **Réinitialisation mot de passe** : email avec token à validité 1h.

**Exigences** :

- Session JWT strategy (pas de DB session) pour compatibilité edge.
- Durée session : 30 jours avec sliding renewal.
- Politique mot de passe : min 8 caractères, 1 chiffre, 1 lettre.
- Rate-limit login : 5 tentatives / 15 min / IP+email (`upstash-ratelimit` ou similaire).
- Page `/auth/login` : tabs ou switch visuel entre « Continuer avec Google » (bouton grand) et formulaire email/mdp.
- À l'inscription : case opt-in WhatsApp avec texte explicite « Recevez votre confirmation de commande et des offres exclusives par WhatsApp ».

---

## 6. Checkout & intégration PayHubSecure

### 6.1 Parcours checkout (3 étapes visibles sur 1 écran mobile scrollable)

1. **Contact** : email (prérempli si connecté), téléphone (obligatoire pour WhatsApp).
2. **Livraison** : sélection adresse existante OU saisie nouvelle + sélection zone de livraison (update des frais).
3. **Paiement** : récap items + frais + total, bouton primaire « Payer [total] FCFA ». Au clic, appel API de création de payment request puis redirection vers l'URL PayHub.

### 6.2 PayHubSecure — flow technique

Basé sur la doc officielle fournie (endpoint `build-away` + IPN). C'est un flow classique de **hosted payment page**.

#### Étape 1 — Création de l'intention de paiement

Côté serveur (`/api/checkout/create-payment`) :

1. Recalculer total depuis DB (ne jamais faire confiance au client).
2. Créer une `Order` en status `PENDING` / paymentStatus `PENDING` avec un code unique (ex: `CP-AAAAMMJJ-NNNN`).
3. Décrémenter temporairement le stock (ou poser un verrou 15 min).
4. Appeler `POST https://rest-airtime.paysecurehub.com/api/payhub-ws/build-away` avec `ApiKey` + `MerchantId` en headers.
5. Stocker le `tokens` retourné dans `order.paymentRef`.
6. Retourner au client `{ url }` pour redirection.

**Payload à envoyer** :

```http
POST https://rest-airtime.paysecurehub.com/api/payhub-ws/build-away
Headers:
  ApiKey: <PAYHUB_API_KEY>
  MerchantId: <PAYHUB_MERCHANT_ID>
  Content-Type: application/json
```

```json
{
  "code_paiement": "<order.code>",
  "nom_usager": "<customerName split>",
  "prenom_usager": "<customerName split>",
  "telephone": "<customerPhone normalisé>",
  "email": "<customerEmail>",
  "libelle_article": "Commande CavePlus",
  "quantite": 1,
  "montant": "<order.total>",
  "lib_order": "Commande <order.code>",
  "Url_Retour": "https://caveplus.ci/checkout/retour?code=<order.code>",
  "Url_Callback": "https://caveplus.ci/api/checkout/ipn"
}
```

**Réponse attendue** :

```json
{
  "tokens": "...",
  "url": "https://payx.paysecurehub.com/payment/...",
  "code": 200,
  "message": "success"
}
```

#### Étape 2 — IPN (webhook)

**Endpoint** : `POST /api/checkout/ipn` — reçu par PayHub après validation/échec du paiement.

**Payload reçu (exemple)** :

```json
{
  "codePaiement": "CP-20260418-0001",
  "referencePaiement": "B402409282227.000001",
  "montant": 35000,
  "moyenPaiement": "MTN Money",
  "numTel": "0555092385",
  "no_transation": "0555092385",
  "datePaiement": "2024-09-28",
  "HeurePaiement": "22:27:19",
  "code": 200,
  "cleretour": "..."
}
```

**Traitement serveur** :

1. **Idempotence** : si `(codePaiement, referencePaiement)` déjà traité en `PAID`, renvoyer `200 OK` sans rien faire.
2. Retrouver l'`Order` via `codePaiement = order.code`.
3. Vérifier que `montant` reçu = `order.total` (sinon log + reject).
4. Vérifier idéalement via IP whitelist PayHub ou signature si disponible.
5. Si `code = 200` → `order.paymentStatus = PAID`, `order.status = CONFIRMED`, persister `paymentTxnId`, `paymentMethod`, `no_transation`.
6. Si `code = 500` → `order.paymentStatus = FAILED`, libérer le stock réservé.
7. Créer un `OrderEvent` (type `PAID` ou `PAYMENT_FAILED`).
8. Déclencher : email de confirmation + message WhatsApp + notification admin.
9. Répondre `200 OK` à PayHub dans les < 5 secondes.

#### Étape 3 — Retour utilisateur

`/checkout/retour?code=CP-...` : la page interroge `/api/orders/[code]/status` et affiche :

- **Paiement validé** → CTA « Suivre ma commande » + « Retour accueil ».
- **En attente** (IPN pas encore arrivé) → poll toutes les 3s pendant 30s, puis message « Vous serez notifié ».
- **Échec** → explication + CTA « Réessayer » (relance paiement sur la même Order).

### 6.3 Variables d'environnement PayHub

```env
PAYHUB_API_BASE_URL=https://rest-airtime.paysecurehub.com/api
PAYHUB_API_KEY=<fourni par PayHub après création marchand>
PAYHUB_MERCHANT_ID=<fourni par PayHub>
PAYHUB_RETURN_URL=https://caveplus.ci/checkout/retour
PAYHUB_CALLBACK_URL=https://caveplus.ci/api/checkout/ipn
```

### 6.4 Sécurité checkout

- Tous les montants recalculés côté serveur, jamais récupérés du body client.
- IPN : logger 100% des payloads reçus dans `AuditLog` même en cas d'erreur.
- Idempotence via colonnes `paymentTxnId` + statut.
- Pas d'accès direct à l'IPN depuis le front — route API serveur uniquement.
- Timeout sortant vers PayHub : 10s + 1 retry en cas de timeout réseau.

---

## 7. Module WhatsApp (WaSender)

Basé sur l'intégration WaSender déjà éprouvée. **Deux usages distincts** : transactionnel (automatique après événement) et marketing (manuel depuis admin).

### 7.1 Variables d'environnement

```env
WHATSAPP_PROVIDER=wasender
WASENDER_API_BASE_URL=https://wasenderapi.com/api
WASENDER_API_KEY=<clé fournie>
WASENDER_SESSION_NAME=CavePlus
WASENDER_TIMEOUT_MS=10000
WHATSAPP_DEFAULT_COUNTRY_CODE=225
WHATSAPP_ADMIN_NUMBERS=+2250700000001,+2250700000002
WHATSAPP_GROUP_BROADCAST_TO=  # JID groupe optionnel
```

### 7.2 Wrapper `lib/wasender.ts`

Exporter des fonctions haut niveau :

- `sendText(to, text)` — normalise le numéro, `GET /status`, `POST /send-message`.
- `sendImage(to, imageUrl, caption?)` — `POST /send-message` avec `imageUrl`.
- `broadcast(recipients[], message, imageUrl?)` — boucle avec throttle (1 msg/2s) + retry.
- `normalizePhone(raw, defaultCC)` — gère `+`, `00`, préfixe `0` → `+225…`.

**Normalisation des numéros (important)** :

- `+...` → conservé
- `00...` → converti en `+...`
- numéro local commençant par `0` → préfixé avec `WHATSAPP_DEFAULT_COUNTRY_CODE`
- numéro numérique sans `+` → préfixé

Exemple avec `WHATSAPP_DEFAULT_COUNTRY_CODE=225` : `0700000001` → `+225700000001`.

### 7.3 Messages transactionnels automatiques

| Déclencheur | Destinataire | Contenu |
|---|---|---|
| Paiement validé (IPN PAID) | Client | ✅ Votre commande `{code}` est confirmée. Montant : `{total}` FCFA. Livraison sous `{eta}`. Détails : `{link}` |
| Statut → PREPARING | Client | 📦 Votre commande `{code}` est en préparation. |
| Statut → SHIPPED | Client | 🚚 Votre commande `{code}` est en route. Contact livreur : `{phone}` |
| Statut → DELIVERED | Client | 🎉 Commande `{code}` livrée. Merci de votre confiance ! |
| Paiement échoué | Client | ⚠️ Paiement non abouti pour `{code}`. Réessayer : `{link}` |
| Nouvelle commande payée | Admins | 🔔 Nouvelle commande `{code}` — `{total}` FCFA — `{customerName}` |
| Stock faible | Admins | 📉 Stock faible : `{productName}` (`{stock}` restants) |
| Abandon panier (24h) | Client opt-in | 🍷 Votre sélection vous attend. Finaliser : `{link}` |

**Implémentation** : file d'attente légère (table `WhatsappSend` en `QUEUED`) + worker (API route cron Vercel toutes les minutes) qui dépile et appelle l'API. Stocker statut, erreur, retry count.

### 7.4 Module de communication admin

**Routes back-office** :

- `/admin/whatsapp` — dashboard : campagnes récentes, quota restant, statut session.
- `/admin/whatsapp/composer` — composer une campagne (texte + image optionnelle + preview mobile).
- `/admin/whatsapp/envois` — historique détaillé par send (livré, échec, erreur).
- `/admin/whatsapp/segments` — définir des segments (opt-in, clients actifs 30j, top spenders…).

**Ciblages supportés** :

- `ALL_CUSTOMERS` : tous les clients avec un téléphone.
- `OPTED_IN` : uniquement ceux avec `whatsappOptIn = true` (requis légalement pour marketing).
- `SEGMENT` : filtres dynamiques (montant total dépensé, nb commandes, dernière commande…).
- `CUSTOM_LIST` : import CSV de numéros ou sélection manuelle.
- **Groupe WhatsApp** : broadcast vers un JID `@g.us` (si configuré).

**Composer UX** :

- Textarea avec compteur caractères + preview rendu WhatsApp (bulle verte à droite).
- Upload image via UploadThing (optionnel, max 5 Mo, converti auto en jpg).
- Variables mergeables : `{firstName}`, `{lastOrderCode}`, `{totalSpent}`…
- Sélecteur cible : type + filtres si segment → affiche preview du nombre de destinataires en temps réel.
- Bouton « Envoyer maintenant » OU planifier (datetime picker).
- Double confirmation avec preview liste réduite (5 premiers destinataires) et total.
- Pendant l'envoi : progress bar + log live.

**Webhook entrant** :

- `/api/whatsapp/webhook` : reçoit les events WaSender (message reçu, statut livraison).
- Mise à jour `WhatsappSend.status` selon accusés de réception.
- Si un client répond « STOP » ou « ARRÊT » → désactiver `whatsappOptIn` automatiquement.

### 7.5 Conformité & quota

- Opt-in explicite requis pour les messages marketing (checkbox à l'inscription + réglable dans `/compte/profil`).
- Lien de désabonnement implicite via la commande STOP (géré dans webhook).
- Throttle : max 1 envoi / 2 sec pour éviter les bans WaSender / WhatsApp.
- Logs complets : chaque envoi persisté avec timestamp, payload, statut, erreur.

---

## 8. Back-office admin

Interface réservée aux rôles `ADMIN` et `STAFF`. Accessible via `/admin` avec middleware de protection. Design sobre, dense en information, **non-mobile-first** (majoritairement utilisé sur desktop) mais doit rester fonctionnel sur tablette.

### 8.1 Layout admin

- Sidebar gauche fixe : navigation principale avec icônes `lucide-react`.
- Topbar : breadcrumb + recherche globale + avatar admin + bouton « voir le site ».
- Contenu principal : tables + formulaires denses, modales pour édition rapide.
- Design tokens dérivés du design public mais plus neutre (fonds blancs, accents bordeaux plus rares).

### 8.2 Modules MVP (périmètre confirmé)

#### 8.2.1 Dashboard (`/admin`)

- KPIs du jour : CA, nb commandes, panier moyen, nouveaux clients.
- Graphe CA 30 derniers jours (`recharts`).
- Alerts : stocks faibles, commandes à traiter, paiements en échec.
- Top produits de la semaine.

#### 8.2.2 Produits (`/admin/produits`)

- Liste paginée : image miniature, nom, catégorie, prix, stock, statut actif, actions.
- Filtres : catégorie, actif/inactif, stock (faible, rupture), recherche texte.
- Bulk actions : activer/désactiver, changer catégorie, supprimer.
- Création/édition : formulaire avec tabs Informations / Médias / Prix & stock / SEO.
- Upload images via UploadThing (drag-drop, jusqu'à 8 images, réordonnable).
- Slug auto-généré depuis nom + édition manuelle possible.
- Prévisualisation de la fiche produit avant publication.

#### 8.2.3 Catégories (`/admin/categories`)

- Arborescence à 2 niveaux (catégorie / sous-catégorie).
- Drag-drop pour réordonner.
- Image de catégorie via UploadThing.
- Masquer/afficher une catégorie sans la supprimer.

#### 8.2.4 Commandes (`/admin/commandes`)

- Liste : code, client, total, statut, paiement, date, actions.
- Filtres : statut, paiement, période, zone de livraison.
- Détail commande : items, adresse, événements, statut editable (dropdown avec confirm).
- Actions : marquer payée manuellement (edge case mobile money offline), rembourser (note interne), annuler.
- Chaque changement de statut → WhatsApp client automatique (respecter opt-in).
- Export CSV de la liste filtrée.
- Bouton « Imprimer bon de livraison » (PDF simple).

#### 8.2.5 Stock (`/admin/stocks`)

- Liste produits avec stock actuel, alerte seuil, dernier mouvement.
- Ajustement manuel : `+` / `-` avec obligation de raison (`INVENTORY_COUNT`, `DAMAGED`, `RESTOCK`…).
- Historique `StockMovement` filtrable par produit et période.
- Badge rouge pour produits sous seuil alerte.

#### 8.2.6 Clients (`/admin/clients`)

- Liste : nom, email, téléphone, nb commandes, total dépensé, dernière activité, opt-in WhatsApp.
- Recherche + filtres (segment, période, opt-in).
- Fiche client : infos perso, adresses, toutes les commandes, envois WhatsApp reçus.
- Action : envoyer un message WhatsApp direct (1-to-1) depuis la fiche.
- Export CSV.
- Note : pas de modification du mot de passe ni de l'email par l'admin (conformité).

#### 8.2.7 CMS (`/admin/cms`)

- Deux onglets : **Blocs** (key-value éditables) et **Pages** (pages statiques).
- Blocs modifiables : titres hero, textes confiance, bloc éditorial accueil, footer, textes footer.
- Pages : « À propos », « Mentions légales », « CGV », « Livraison », « Localisation ».
- Éditeur : textarea markdown + preview live (`react-markdown`).
- Upload d'image inline (UploadThing) avec insertion markdown automatique.
- Chaque modification : revalidation ISR de la page concernée.

#### 8.2.8 WhatsApp (`/admin/whatsapp`)

Voir section 7.4 pour le détail.

#### 8.2.9 Statistiques (`/admin/statistiques`)

- Périodes : jour, 7j, 30j, 90j, année, custom.
- KPIs : CA, commandes, panier moyen, taux conversion, nouveaux clients, clients récurrents.
- Graphiques : CA par jour (line), CA par catégorie (bar), top produits (table), répartition moyens paiement (pie).
- Export des données graphées en CSV.

#### 8.2.10 Paramètres (`/admin/parametres`)

- Informations boutique : nom, logo, adresse, email, téléphone.
- Zones de livraison : CRUD (nom, frais, ETA).
- Numéros admin WhatsApp.
- Seuils d'alerte stock par défaut.
- Codes promo : CRUD (code, type, valeur, validité, nb utilisations max).
- Gestion utilisateurs admin : invitation par email, attribution rôle `ADMIN`/`STAFF`.

### 8.3 Permissions

| Action | CUSTOMER | STAFF | ADMIN |
|---|:---:|:---:|:---:|
| Parcourir/commander | ✅ | ✅ | ✅ |
| Accès `/admin` | ❌ | ✅ | ✅ |
| Gérer produits/stock | ❌ | ✅ | ✅ |
| Gérer commandes | ❌ | ✅ | ✅ |
| Voir clients | ❌ | ✅ | ✅ |
| Envoyer WhatsApp 1-to-1 | ❌ | ✅ | ✅ |
| Lancer broadcast WhatsApp | ❌ | ❌ | ✅ |
| Modifier CMS | ❌ | ❌ | ✅ |
| Modifier paramètres boutique | ❌ | ❌ | ✅ |
| Inviter autres admins | ❌ | ❌ | ✅ |

### 8.4 Audit trail

- Toute action admin sensible (changement statut commande, modif prix, envoi broadcast, ajustement stock) écrit un `AuditLog`.
- Consultable dans un panneau read-only par les `ADMIN` uniquement.

---

## 9. Sécurité, performance & qualité

### 9.1 Sécurité

- Toutes les API `/admin/*` protégées par middleware vérifiant `role ∈ {ADMIN, STAFF}`.
- Validation de chaque input serveur via **Zod** (body, params, query).
- Rate-limiting sur routes sensibles : auth, checkout, broadcast.
- CSRF : NextAuth gère pour ses endpoints ; pour les autres, s'appuyer sur `SameSite=Lax` cookies.
- Headers de sécurité : CSP restrictive, `X-Frame-Options DENY`, HSTS, `Referrer-Policy strict-origin`.
- Secrets : uniquement dans `.env`, jamais commités, gérés côté Vercel pour prod.
- Logs : pas de PII ni de secrets dans les logs applicatifs (masquer téléphones partiellement).
- Dépendances : Dependabot actif, audit npm dans CI.

### 9.2 Performance

- **ISR** pour `/`, `/catalogue`, `/categorie/[slug]`, `/produit/[slug]` (revalidate 300s).
- Revalidation on-demand déclenchée par admin après modification produit/catégorie/CMS.
- **Images** : `next/image` + UploadThing, lazy-loading hors viewport initial, formats AVIF/WebP.
- Polices Outfit/Inter en `next/font` avec `display=swap`, preload des poids critiques.
- Bundle : code splitting par route, pas de lib lourde dans `_app`.
- DB : index sur toutes les colonnes de filtre (déjà dans schema), connection pool Prisma configuré pour serverless.
- Caching : HTTP cache pour assets statiques, `stale-while-revalidate` pour listes produits côté API.

**Budgets cibles (mobile 4G)** :

| Métrique | Cible | Seuil critique |
|---|---|---|
| LCP | < 2.5s | < 4s |
| INP | < 200ms | < 500ms |
| CLS | < 0.1 | < 0.25 |
| Lighthouse Perf (mobile) | ≥ 90 | ≥ 75 |
| JS initial | < 180 KB gz | < 250 KB gz |

### 9.3 Qualité & tests

- ESLint + Prettier + Husky pre-commit (lint + typecheck).
- Tests unitaires : **Vitest** sur la couche `lib/` (normalisation téléphone, calcul panier, formatters).
- Tests E2E : **Playwright** sur parcours critiques (navigation, ajout panier, login Google mock, checkout avec PayHub sandbox).
- CI GitHub Actions : lint + typecheck + unit + E2E headless sur chaque PR.
- Environnements : local, staging (branch preview Vercel), production.

### 9.4 Monitoring & observabilité

- **Sentry** : erreurs front + API + session replay limité aux erreurs.
- **Vercel Analytics** : Web Vitals.
- Logs structurés (JSON) sur les API routes critiques : checkout, IPN, whatsapp.
- Alerting : Sentry → email admin sur erreur non-gérée en production.

---

## 10. SEO & visibilité

> **Objectif** : faire de CavePlus la référence en ligne pour l'achat de vins, spiritueux et champagnes en Côte d'Ivoire. Le SEO n'est pas une optimisation post-launch, c'est une exigence **dès la conception** des pages et du schema.

### 10.1 Stratégie de contenu & mots-clés cibles

Marché cible prioritaire : Abidjan + grandes villes CI, secondaire : francophones UEMOA.

**Clusters de mots-clés à couvrir** (à valider avec un outil comme Ahrefs ou Google Keyword Planner en phase 2) :

| Intent | Exemples de requêtes | Page cible |
|---|---|---|
| Navigationnel | `caveplus`, `cave plus abidjan` | `/` |
| Transactionnel générique | `acheter vin abidjan`, `livraison whisky cote d'ivoire`, `champagne en ligne ci` | `/catalogue`, catégories |
| Transactionnel catégorie | `acheter champagne moët abidjan`, `whisky single malt ci`, `rhum premium livraison abidjan` | `/categorie/[slug]` |
| Transactionnel produit | `prix dom pérignon abidjan`, `hennessy vs prix côte d'ivoire` | `/produit/[slug]` |
| Informationnel (blog phase 2) | `accord mets vin`, `comment choisir un whisky`, `quel champagne pour mariage` | `/blog/[slug]` (futur) |
| Local | `cave à vin plateaux`, `livraison alcool cocody` | `/localisation`, footer |

**Règles de rédaction** :

- Chaque page a un angle éditorial unique (pas de contenu dupliqué entre catégorie mère et sous-catégorie).
- Produits : description ≥ 150 mots idéalement, avec producteur, région, millésime, notes de dégustation, accords mets.
- Catégories : paragraphe d'intro ≥ 100 mots en haut de page (éditable CMS) décrivant la catégorie, avant la grille produits.
- Éviter le keyword stuffing — rédiger pour l'humain d'abord, Google ensuite.

### 10.2 Architecture d'URL & technique

**URLs** : propres, stables, en français, minuscules, avec tirets.

```
✅  /produit/champagne-moet-chandon-brut-imperial
✅  /categorie/champagnes
✅  /categorie/whiskies/single-malt           (2e niveau autorisé)
❌  /produit/12345
❌  /products/Champagne_Moet-Chandon.html
```

**Exigences techniques** :

- Slugs générés automatiquement depuis le nom, **éditables manuellement** depuis le back-office, **immuables après première publication** (ou redirection 301 automatique si modifié).
- Pas de paramètres GET sur les URL canoniques (filtres via path ou canonique pointant vers la version propre).
- Trailing slash policy : **sans** trailing slash partout, config Next.js `trailingSlash: false`.
- HTTPS forcé, redirection `http://` et `www.` → domaine canonique (ex: `https://caveplus.ci`).

### 10.3 Rendu & indexabilité

**Stratégie de rendu par type de page** :

| Type | Rendu | Revalidation |
|---|---|---|
| `/` (accueil) | **ISR** | 300s + on-demand à la modif CMS |
| `/catalogue`, `/categorie/[slug]` | **ISR** | 300s + on-demand à la modif produit/catégorie |
| `/produit/[slug]` | **ISR** + `fallback: 'blocking'` | 300s + on-demand à la modif produit |
| `/a-propos`, `/localisation`, pages CMS | **ISR** | 3600s + on-demand à la modif CMS |
| `/panier`, `/checkout`, `/compte/*` | **SSR** ou CSR | `noindex` |
| `/admin/*` | SSR | `noindex, nofollow` |
| `/auth/*` | SSR | `noindex` |

**Point critique** : le contenu SEO-utile (titre produit, description, prix, disponibilité, fil d'Ariane) **doit être présent dans le HTML servi**, pas chargé après hydration. Google indexe le HTML initial de manière fiable ; tout ce qui dépend d'un fetch côté client est un risque.

### 10.4 Balises méta & Open Graph

Un composant `<Seo />` réutilisable dans `src/components/layout/Seo.tsx` injecte toutes les balises nécessaires via `next/head`.

**Balises obligatoires par page** :

```html
<title>{{title}} — CavePlus</title>
<meta name="description" content="{{description}}" />
<link rel="canonical" href="https://caveplus.ci{{pathname}}" />
<meta name="robots" content="{{index|noindex}},{{follow|nofollow}}" />

<!-- Open Graph -->
<meta property="og:type" content="{{website|product|article}}" />
<meta property="og:title" content="{{title}}" />
<meta property="og:description" content="{{description}}" />
<meta property="og:url" content="https://caveplus.ci{{pathname}}" />
<meta property="og:image" content="{{imageUrl (1200x630)}}" />
<meta property="og:locale" content="fr_FR" />
<meta property="og:site_name" content="CavePlus" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{title}}" />
<meta name="twitter:description" content="{{description}}" />
<meta name="twitter:image" content="{{imageUrl}}" />
```

**Règles de rédaction des balises** :

| Balise | Longueur cible | Règles |
|---|---|---|
| `<title>` | 50-60 car. | Mot-clé principal en premier, marque en fin avec séparateur ` — ` |
| `<meta description>` | 140-160 car. | Accroche + bénéfice + CTA implicite |
| `og:image` | 1200×630 px | Image produit sur fond crème avec logo discret |

**Templates par type de page** :

- Accueil : `CavePlus — Cave à vins, champagnes et spiritueux à Abidjan`
- Catégorie : `{{CategoryName}} — Sélection premium | CavePlus`
- Produit : `{{ProductName}} — {{Producer}} | CavePlus`
- Page CMS : `{{PageTitle}} | CavePlus`

**Champ SEO dans le back-office** (section 8.2.2 à enrichir) : tab « SEO » sur la fiche produit et catégorie avec `metaTitle`, `metaDescription`, `ogImage`, `noindex` (toggle). Fallback automatique sur les champs nom/description si vide.

### 10.5 Données structurées (JSON-LD)

Chaque type de page injecte les **schemas Schema.org** appropriés via une balise `<script type="application/ld+json">`.

**Organisation (dans `<head>` global)** :

```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "CavePlus",
  "url": "https://caveplus.ci",
  "logo": "https://caveplus.ci/logo.png",
  "image": "https://caveplus.ci/og-cover.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "...",
    "addressLocality": "Abidjan",
    "addressCountry": "CI"
  },
  "telephone": "+225...",
  "sameAs": ["https://facebook.com/...", "https://instagram.com/..."]
}
```

**Produit (sur `/produit/[slug]`)** — critique pour les rich results Google :

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{product.name}}",
  "image": ["{{product.images[0..n].url}}"],
  "description": "{{product.description}}",
  "sku": "{{product.sku}}",
  "brand": { "@type": "Brand", "name": "{{product.producer}}" },
  "offers": {
    "@type": "Offer",
    "url": "https://caveplus.ci/produit/{{slug}}",
    "priceCurrency": "XOF",
    "price": "{{product.price}}",
    "availability": "{{stock > 0 ? 'InStock' : 'OutOfStock'}}",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

**Fil d'Ariane (toutes les pages profondes)** :

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://caveplus.ci/" },
    { "@type": "ListItem", "position": 2, "name": "Champagnes", "item": "https://caveplus.ci/categorie/champagnes" },
    { "@type": "ListItem", "position": 3, "name": "Moët & Chandon Brut Impérial" }
  ]
}
```

**Autres schemas à prévoir** :

- `LocalBusiness` sur `/localisation` (adresse, horaires, coordonnées GPS).
- `FAQPage` sur `/a-propos` si section FAQ présente.
- `WebSite` avec `SearchAction` sur l'accueil pour activer le sitelinks search box Google.

**Validation** : tester systématiquement avec [Google Rich Results Test](https://search.google.com/test/rich-results) avant mise en prod.

### 10.6 Sitemap & robots

**`/sitemap.xml`** généré dynamiquement (recréé à chaque build + revalidation on-demand) :

- Route : `src/pages/sitemap.xml.ts` (SSR).
- Contient toutes les URLs publiques : `/`, `/catalogue`, toutes les catégories, tous les produits **actifs**, pages CMS publiées.
- `<lastmod>` basé sur `updatedAt` de chaque entité.
- Exclut : `/panier`, `/checkout`, `/compte/*`, `/auth/*`, `/admin/*`.
- Soumis à **Google Search Console** et **Bing Webmaster Tools** dès la mise en ligne.

**`/robots.txt`** servi depuis `public/robots.txt` :

```
User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /compte/
Disallow: /checkout
Disallow: /panier
Disallow: /auth/
Disallow: /*?*          # évite l'indexation des URL à paramètres

Sitemap: https://caveplus.ci/sitemap.xml
```

En environnement de **staging**, le robots.txt doit être `User-agent: * / Disallow: /` pour éviter l'indexation des previews Vercel.

### 10.7 Performance SEO (Core Web Vitals)

Google utilise les Core Web Vitals comme signal de ranking. Les budgets définis en section 9.2 sont **non-négociables pour les pages SEO prioritaires** (accueil, catégories, produits).

Points d'attention spécifiques :

- **LCP** : l'image hero de la fiche produit doit avoir l'attribut `priority` dans `next/image`, les autres lazy-loadées.
- **CLS** : toujours définir `width` et `height` sur les images, réserver l'espace pour les badges dynamiques (promo, rupture).
- **INP** : drawer panier et ajout produit ne doivent pas bloquer le main thread > 200ms.
- Éviter les polices non-optimisées : `next/font` avec `display: swap` est obligatoire.

### 10.8 Gestion des redirections & erreurs

**Redirections 301** à gérer (table `Redirect` en DB ou `next.config.js` selon volume) :

- Changement de slug produit/catégorie → redirection 301 automatique de l'ancien vers le nouveau.
- Produit supprimé → 301 vers la catégorie parente (pas vers l'accueil, trop générique).
- Produit désactivé temporairement (rupture longue) → garder la page, juste afficher « Indisponible » ; **ne pas** 404 ni 301.

**Ajouter au schema Prisma** (complément à la section 4.1) :

```prisma
model Redirect {
  id         String   @id @default(cuid())
  fromPath   String   @unique
  toPath     String
  statusCode Int      @default(301)
  createdAt  DateTime @default(now())
  @@index([fromPath])
}
```

Middleware Next.js à `src/middleware.ts` intercepte les requêtes et applique les redirections depuis cette table (cache mémoire 5 min pour perf).

**Page 404** : custom, branded, suggère les catégories populaires et un champ de recherche. Renvoie bien `404` (pas `200` — erreur SEO classique dite « soft 404 »).

### 10.9 Internationalisation (préparation future)

Pour la phase 3 (multi-langue FR/EN) :

- Structure URL prévue dès le départ : `/fr/...` et `/en/...` avec `fr` par défaut (sans préfixe pour ne pas casser le SEO actuel).
- Balises `hreflang` à ajouter le moment venu.
- Ne pas câbler `next-i18next` maintenant si ça complexifie le MVP, mais garder les textes dans des fichiers séparés pour faciliter la transition.

### 10.10 Outils & suivi

À configurer dès la mise en production :

- **Google Search Console** : propriété vérifiée, sitemap soumis, monitoring des erreurs d'indexation.
- **Bing Webmaster Tools** : même config (part de marché non négligeable en B2B/desktop).
- **Google Analytics 4** OU **Plausible** / **Umami** (plus respectueux de la vie privée, pas de bandeau cookies).
- **Ahrefs / SEMrush** (optionnel phase 2) pour suivi de positions.
- **Tableau de bord interne** dans `/admin/statistiques` : top pages visitées, requêtes de recherche interne les plus fréquentes (remonter dans les filtres catalogue).

### 10.11 Checklist SEO — Definition of Done

Avant chaque mise en production, vérifier :

- [ ] Chaque page publique a un `<title>`, `<meta description>`, `<link rel="canonical">` remplis.
- [ ] Open Graph présent sur chaque page (preview sur [OpenGraph.xyz](https://www.opengraph.xyz/)).
- [ ] JSON-LD Product valide sur chaque fiche produit (testé avec Rich Results Test).
- [ ] JSON-LD BreadcrumbList sur toutes les pages profondes.
- [ ] `sitemap.xml` accessible et contient toutes les URLs attendues.
- [ ] `robots.txt` correctement configuré (prod vs staging).
- [ ] Aucune page `noindex` par erreur (scan avec Screaming Frog recommandé).
- [ ] Aucun lien cassé interne (404).
- [ ] Core Web Vitals au vert en PageSpeed Insights (mobile) pour accueil, 3 catégories phares, 3 produits phares.
- [ ] Google Search Console : propriété vérifiée, sitemap soumis, pas d'erreur critique.
- [ ] Redirections 301 testées pour les anciens slugs si migration depuis l'ancien site.

---

## 11. Roadmap

### 11.1 Phase 1 — MVP (semaines 1-4)

- Setup projet, DB, auth (Google + credentials), schémas Prisma, seed de démo.
- Front public : accueil, catalogue, fiche produit, panier, checkout.
- Intégration PayHub end-to-end avec IPN.
- Notifications WhatsApp transactionnelles (confirmation paiement, statut commande).
- Back-office : produits, catégories, commandes, stock, clients.
- **SEO fondations** : composant `<Seo />`, balises méta dynamiques, JSON-LD Product + Breadcrumb, `sitemap.xml`, `robots.txt`, ISR sur pages SEO.
- Déploiement staging + recette client.

### 11.2 Phase 2 — Consolidation (semaines 5-6)

- CMS (blocs + pages).
- Statistiques dashboard.
- Module WhatsApp marketing (broadcast, segments, planification).
- Codes promo.
- **SEO avancé** : champs SEO éditables dans le back-office (metaTitle, metaDescription, ogImage par produit/catégorie), gestion des redirections 301 (table `Redirect` + middleware), Google Search Console + Analytics configurés.
- Tests E2E complets.
- Passage en production.

### 11.3 Phase 3 — Post-launch (hors périmètre immédiat)

- Fournisseurs + commandes fournisseurs.
- Wishlist avancée, avis clients (permettent d'ajouter du schema `AggregateRating` et d'enrichir les rich snippets), programme de fidélité.
- **Blog éditorial** pour capturer le trafic informationnel (accords mets-vins, guides d'achat) — levier SEO majeur à long terme.
- App mobile PWA avec push notifications.
- Multi-langue (français + anglais) avec `hreflang`.

---

## 12. Instructions pour Cursor AI

> *Cette section est destinée spécifiquement à l'exécution par Cursor AI. Elle définit la méthode attendue pour générer le code à partir de ce PRD.*

### 12.1 Règles de génération

1. **Lis intégralement ce PRD** avant d'écrire la moindre ligne de code.
2. Respecte la stack imposée (section 2.1) sans substitution.
3. Démarre par : `npx create-next-app@latest caveplus --typescript --tailwind --eslint --src-dir` puis choisir **Pages Router**.
4. Pose le `schema.prisma` exact de la section 4.1 avant d'écrire du code applicatif.
5. Crée le fichier `.env.example` listant toutes les variables (auth, PayHub, WaSender, UploadThing, DB, email).
6. Structure les dossiers comme en section 2.3. Ne crée pas de pages ou API non listées sans justification.
7. Chaque composant UI utilise **shadcn/ui** quand possible, stylé avec les tokens définis en section 3.
8. Valide chaque input serveur avec **Zod**.
9. Toute fonction I/O externe (PayHub, WaSender, email) est isolée dans `src/lib/` avec types TS explicites.
10. Écris des messages de commit sémantiques (`feat:`, `fix:`, `chore:`, `refactor:`).

### 12.2 Ordre de livraison recommandé

1. Infra : Prisma schema + migration + seed + `lib/prisma.ts`.
2. Auth : NextAuth config + pages login/inscription + protection admin middleware.
3. Modèles & API produits/catégories/panier (sans UI d'abord).
4. UI publique : layout, accueil, catalogue, fiche produit, panier.
5. Checkout + PayHub + IPN.
6. WhatsApp transactionnel.
7. Back-office produits/commandes/stock/clients.
8. CMS + stats.
9. WhatsApp marketing.
10. Tests E2E + polish + déploiement.

### 12.3 Points à clarifier avec le product owner avant de coder

- Clés API réelles de **PayHubSecure** (sandbox ou prod ?).
- Compte **WaSender** : session à configurer, numéro WhatsApp d'émission.
- Compte **Google Cloud** pour OAuth : client ID / secret.
- Domaine de production + configuration DNS.
- Contenu éditorial initial (à propos, mentions légales, CGV).
- Photos produits haute résolution pour le seed de démo.

### 12.4 Definition of Done par feature

- Code TypeScript strict sans `any` non justifié.
- Validation Zod sur tous les inputs API.
- Gestion d'erreurs explicite (pas de catch silencieux).
- Au moins un test unitaire pour la logique métier critique.
- Responsive vérifié à 360px, 768px, 1280px.
- Accessibilité : labels, focus visible, contraste AA.
- Doc technique : JSDoc sur fonctions `lib/` exportées.

---

*Fin du document — PRD CavePlus v1.0*
