import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/library'],
        disallow: ['/api/', '/admin', '/notes/'],
      },
    ],
    sitemap: 'https://smartstudy.app/sitemap.xml',
  };
}
