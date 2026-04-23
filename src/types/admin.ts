export type AdminOrder = {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  whatsappOptIn: boolean;
};

export type BroadcastCampaign = {
  id: string;
  title: string;
  audience: string;
  scheduledFor: string;
  status: string;
};

export type CmsBlock = {
  id: string;
  title: string;
  type: string;
  updatedAt: string;
  status: string;
};
