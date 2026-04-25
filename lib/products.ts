import { Product } from '@/types';

// Prices are in USD cents
export const products: Product[] = [
  // ── Necklaces ─────────────────────────────────────────────────────────────
  {
    id: 'kundan-bridal-necklace-set',
    slug: 'kundan-bridal-necklace-set',
    name: 'Kundan Bridal Necklace Set',
    price: 18900,
    originalPrice: 22900,
    category: 'Necklaces',
    material: '22K Gold Plated',
    description:
      'Exquisite kundan bridal necklace set with matching earrings and maang tikka. Handcrafted by master artisans using traditional Rajasthani techniques, each stone is hand-set for a regal finish that will make your wedding unforgettable.',
    details: [
      '22K Gold Plated Brass base',
      'Genuine Kundan & Polki stone setting',
      'Set includes: Necklace, Earrings & Maang Tikka',
      'Adjustable length: 16–18 inches',
      'Hypoallergenic — nickel & lead free',
      'Comes in a luxury gift box',
    ],
    images: [
      'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    badge: 'Bestseller',
    inStock: true,
    sku: 'PF-NK-001',
    weight: '120g',
  },
  {
    id: 'jadau-haar-necklace',
    slug: 'jadau-haar-necklace',
    name: 'Jadau Haar Statement Necklace',
    price: 27900,
    category: 'Necklaces',
    material: '22K Gold Plated',
    description:
      'A heirloom-quality Jadau haar necklace with natural gemstones set using the ancient Jadau technique. A showstopper for weddings and celebrations.',
    details: [
      '22K Gold Plated with high-polish finish',
      'Natural ruby & emerald gemstone accents',
      'Traditional Jadau inlay work',
      'Length: 18 inches + 2" extender',
      'Includes a certificate of craftsmanship',
      'Gift-wrapped in a luxury box',
    ],
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9519f94815b5?w=800&q=80',
    ],
    badge: 'Premium',
    inStock: true,
    sku: 'PF-NK-002',
    weight: '140g',
  },
  {
    id: 'oxidised-silver-choker',
    slug: 'oxidised-silver-choker',
    name: 'Oxidised Silver Tribal Choker',
    price: 3900,
    category: 'Necklaces',
    material: 'Oxidised Silver',
    description:
      'A bold oxidised silver choker with tribal-inspired patterns from the artisans of Rajasthan. Pairs beautifully with both traditional and Indo-Western outfits.',
    details: [
      'Oxidised German Silver',
      'Adjustable fit: 14–16 inches',
      'Hypoallergenic',
      'Perfect for everyday wear',
    ],
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
    ],
    badge: 'New',
    inStock: true,
    sku: 'PF-NK-003',
    weight: '55g',
  },
  {
    id: 'pearl-layered-necklace',
    slug: 'pearl-layered-necklace',
    name: 'Pearl & Gold Layered Necklace',
    price: 7900,
    originalPrice: 9900,
    category: 'Necklaces',
    material: '18K Gold Plated',
    description:
      'Elegant multi-strand pearl and gold necklace inspired by Hyderabadi jewellery traditions. The perfect balance of classic and contemporary, suited to both formal and festive occasions.',
    details: [
      '18K Gold Plated',
      'Freshwater cultured pearls',
      '3-strand layered design',
      'Length: 16–20 inches adjustable',
      'Hypoallergenic lobster clasp',
    ],
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    ],
    badge: 'Sale',
    inStock: true,
    sku: 'PF-NK-004',
    weight: '65g',
  },

  // ── Earrings ──────────────────────────────────────────────────────────────
  {
    id: 'meenakari-jhumka-earrings',
    slug: 'meenakari-jhumka-earrings',
    name: 'Meenakari Jhumka Earrings',
    price: 4900,
    category: 'Earrings',
    material: '18K Gold Plated',
    description:
      'Vibrant meenakari jhumkas with intricate hand-painted enamel work in peacock motifs. A celebration of color and craft from the artisans of Jaipur.',
    details: [
      '18K Gold Plated',
      'Hand-painted Meenakari enamel — each piece is unique',
      'Fish hook closure',
      'Drop length: 2.4 inches',
      'Hypoallergenic — nickel & lead free',
    ],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80',
    ],
    badge: 'Bestseller',
    inStock: true,
    sku: 'PF-ER-001',
    weight: '30g',
  },
  {
    id: 'kundan-drop-earrings',
    slug: 'kundan-drop-earrings',
    name: 'Kundan Long Drop Earrings',
    price: 6900,
    category: 'Earrings',
    material: '22K Gold Plated',
    description:
      'Dramatic long drop earrings featuring hand-set kundan stones and delicate gold filigree work. A statement piece for bridal parties, receptions, and festive celebrations.',
    details: [
      '22K Gold Plated',
      'Hand-set Kundan stones',
      'Gold filigree detailing',
      'Drop length: 3.5 inches',
      'Push-back closure',
      'Comes in a satin pouch',
    ],
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    ],
    inStock: true,
    sku: 'PF-ER-002',
    weight: '25g',
  },
  {
    id: 'gold-stud-earrings',
    slug: 'gold-stud-earrings',
    name: 'Floral Gold Stud Earrings',
    price: 2900,
    category: 'Earrings',
    material: '22K Gold Plated',
    description:
      'Dainty floral stud earrings inspired by traditional South Indian temple jewellery. Lightweight and elegant — perfect for everyday wear or to complement a saree.',
    details: [
      '22K Gold Plated Brass',
      'Floral motif with stone centre',
      'Push-back stud closure',
      'Diameter: 1.2 cm',
      'Hypoallergenic',
    ],
    images: [
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80',
      'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800&q=80',
    ],
    badge: 'New',
    inStock: true,
    sku: 'PF-ER-003',
    weight: '8g',
  },

  // ── Bangles ───────────────────────────────────────────────────────────────
  {
    id: 'temple-jewellery-bangles-set',
    slug: 'temple-jewellery-bangles-set',
    name: 'Temple Jewellery Bangles Set',
    price: 8900,
    category: 'Bangles',
    material: 'Antique Gold',
    description:
      'Set of 6 South Indian temple jewellery bangles with traditional deity motifs and ruby-red stones. Inspired by the jewellery worn by classical Bharatanatyam dancers.',
    details: [
      'Antique gold finish',
      'Set of 6 bangles',
      'Available sizes: 2.4", 2.6", 2.8" (specify on order)',
      'Ruby red & emerald green stones',
      'Traditional Kempstone setting',
    ],
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94815b5?w=800&q=80',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
    ],
    badge: 'Bestseller',
    inStock: true,
    sku: 'PF-BG-001',
    weight: '180g',
  },
  {
    id: 'kundan-bangle-pair',
    slug: 'kundan-bangle-pair',
    name: 'Kundan Enamel Bangle Pair',
    price: 5900,
    originalPrice: 7400,
    category: 'Bangles',
    material: '22K Gold Plated',
    description:
      'A stunning pair of broad kundan bangles with intricate meenakari enamel work on the inside. The outside is adorned with hand-set kundan stones in a paisley pattern.',
    details: [
      '22K Gold Plated',
      'Kundan stone setting on exterior',
      'Meenakari enamel interior',
      'Pair of 2 bangles',
      'Size: 2.6" (custom sizes available — contact us)',
    ],
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
    ],
    badge: 'Sale',
    inStock: true,
    sku: 'PF-BG-002',
    weight: '120g',
  },

  // ── Maang Tikka ───────────────────────────────────────────────────────────
  {
    id: 'polki-maang-tikka',
    slug: 'polki-maang-tikka',
    name: 'Polki Diamond Maang Tikka',
    price: 10900,
    category: 'Maang Tikka',
    material: '22K Gold Plated',
    description:
      'A stunning polki maang tikka that drapes elegantly on the forehead. The uncut diamond-effect polki stones catch light beautifully, making this a bridal favourite.',
    details: [
      '22K Gold Plated Sterling Silver base',
      'Polki & CZ stones',
      'Adjustable chain — fits all head sizes',
      'Weight: approx. 35g',
      'Comes in a satin pouch',
    ],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
    ],
    badge: 'Bestseller',
    inStock: true,
    sku: 'PF-MT-001',
    weight: '40g',
  },
  {
    id: 'kundan-passa-tikka',
    slug: 'kundan-passa-tikka',
    name: 'Kundan Passa Side Tikka',
    price: 8400,
    category: 'Maang Tikka',
    material: '22K Gold Plated',
    description:
      'A beautiful passa-style side maang tikka featuring cascading kundan drops. Worn across the side parting, this piece adds a dramatic bridal touch inspired by Mughal jewellery traditions.',
    details: [
      '22K Gold Plated',
      'Hand-set Kundan stones',
      'Cascading drop design',
      'Adjustable chain',
      'Fits left or right parting',
    ],
    images: [
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80',
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80',
    ],
    badge: 'New',
    inStock: true,
    sku: 'PF-MT-002',
    weight: '38g',
  },
  {
    id: 'pearl-maang-tikka',
    slug: 'pearl-maang-tikka',
    name: 'Pearl Drop Maang Tikka',
    price: 3900,
    category: 'Maang Tikka',
    material: '18K Gold Plated',
    description:
      'A delicate and elegant maang tikka featuring a freshwater pearl drop centre surrounded by gold petals. Lightweight enough for all-day wear, beautiful enough for a wedding.',
    details: [
      '18K Gold Plated',
      'Freshwater cultured pearl centre',
      'Adjustable chain: 4–7 inches',
      'Weight: 12g',
      'Suitable for everyday and festive wear',
    ],
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    ],
    inStock: true,
    sku: 'PF-MT-003',
    weight: '12g',
  },
];

export const categories = ['All', 'Necklaces', 'Earrings', 'Bangles', 'Maang Tikka'];

/** Format USD cents → "$189" */
export function formatUSD(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export const FREE_SHIPPING_THRESHOLD = 10000; // $100 in cents
export const FLAT_SHIPPING = 999;             // $9.99 in cents
