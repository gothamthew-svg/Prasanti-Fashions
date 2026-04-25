export type ColorVariant = {
  name:   string;   // e.g. "Gold", "Rose Gold", "Silver", "Antique"
  hex:    string;   // e.g. "#d4a017"
  images: string[]; // images for this specific color
};

export type Product = {
  id:             string;
  slug:           string;
  name:           string;
  price:          number;          // cents USD
  originalPrice?: number;
  category:       string;
  material:       string;
  description:    string;
  details:        string[];
  images:         string[];        // default/primary images
  colorVariants:  ColorVariant[];  // color options with their own images
  badge?:         'Bestseller' | 'New' | 'Premium' | 'Sale';
  inStock:        boolean;
  sku:            string;
  weight:         string;
  occasion?:      string[];        // ['Wedding', 'Festival', 'Everyday']
  metalType?:     string;          // 'Gold Plated', 'Silver', 'Antique'
  gemstone?:      string;          // 'Kundan', 'CZ', 'Emerald'
  collectionName?: string;         // 'Bridal Edit', 'Everyday Luxe'
};

export type CartItem = Product & {
  quantity:      number;
  selectedColor?: string; // color variant name
};

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id:             string;
  stripeSession:  string;
  customerEmail:  string;
  customerName:   string;
  amountTotal:    number;
  status:         OrderStatus;
  items:          CartItem[];
  createdAt:      string;
};

export type ContactFormData = {
  name:     string;
  email:    string;
  phone?:   string;
  subject:  string;
  message:  string;
};

export type AnalyticsData = {
  totalRevenue:    number;
  totalOrders:     number;
  avgOrderValue:   number;
  uniqueCustomers: number;
  revenue30d:      number;
  orders30d:       number;
  revenue7d:       number;
  orders7d:        number;
  revenueByDay:    { date: string; revenue: number; orders: number }[];
  topProducts:     { name: string; revenue: number; units: number }[];
  recentOrders:    Order[];
  lowStock:        { name: string; sku: string; inStock: boolean }[];
};
