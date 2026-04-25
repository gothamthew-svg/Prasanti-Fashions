import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prafashions.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cart', '/success'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
