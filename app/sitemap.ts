import { MetadataRoute } from 'next';
import { products } from '@/lib/products';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prafashions.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl,             priority: 1.0,  changeFrequency: 'weekly' },
    { url: `${siteUrl}/products`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${siteUrl}/about`,  priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${siteUrl}/contact`, priority: 0.6, changeFrequency: 'monthly' },
  ];

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url:             `${siteUrl}/products/${p.slug}`,
    priority:        0.8,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticPages, ...productPages];
}
