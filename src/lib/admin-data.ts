import type { AdminCustomer, AdminOrder, BroadcastCampaign, CmsBlock } from "@/types/admin";

export const adminOrders: AdminOrder[] = [
  {
    id: "CMD-2026-0012",
    customerName: "Aminata Traore",
    phone: "+2250700001111",
    total: 140700,
    status: "En preparation",
    paymentStatus: "Paye",
    createdAt: "18 avril 2026 - 10:12"
  },
  {
    id: "CMD-2026-0011",
    customerName: "Benoit Niamke",
    phone: "+2250700002222",
    total: 49900,
    status: "Payee",
    paymentStatus: "Paye",
    createdAt: "18 avril 2026 - 09:46"
  },
  {
    id: "CMD-2026-0010",
    customerName: "Societe Horizon",
    phone: "+2250700003333",
    total: 325000,
    status: "Livree",
    paymentStatus: "Paye",
    createdAt: "17 avril 2026 - 16:08"
  }
];

export const adminCustomers: AdminCustomer[] = [
  {
    id: "CUS-001",
    name: "Aminata Traore",
    email: "aminata@example.ci",
    phone: "+2250700001111",
    totalOrders: 6,
    totalSpent: 532000,
    whatsappOptIn: true
  },
  {
    id: "CUS-002",
    name: "Benoit Niamke",
    email: "benoit@example.ci",
    phone: "+2250700002222",
    totalOrders: 2,
    totalSpent: 98900,
    whatsappOptIn: false
  },
  {
    id: "CUS-003",
    name: "Societe Horizon",
    email: "achats@horizon.ci",
    phone: "+2250700003333",
    totalOrders: 14,
    totalSpent: 2430000,
    whatsappOptIn: true
  }
];

export const broadcastCampaigns: BroadcastCampaign[] = [
  {
    id: "BRC-001",
    title: "Arrivage champagnes premium",
    audience: "Clients VIP WhatsApp",
    scheduledFor: "19 avril 2026 - 11:00",
    status: "Planifie"
  },
  {
    id: "BRC-002",
    title: "Offre fete d'entreprise",
    audience: "Corporate",
    scheduledFor: "20 avril 2026 - 09:00",
    status: "Brouillon"
  }
];

export const cmsBlocks: CmsBlock[] = [
  {
    id: "CMS-HERO",
    title: "Hero accueil",
    type: "Hero",
    updatedAt: "18 avril 2026",
    status: "Publie"
  },
  {
    id: "CMS-CAT",
    title: "Introduction categorie Champagnes",
    type: "SEO",
    updatedAt: "17 avril 2026",
    status: "Publie"
  },
  {
    id: "CMS-ABOUT",
    title: "Bloc A propos",
    type: "Rich text",
    updatedAt: "16 avril 2026",
    status: "Brouillon"
  }
];
