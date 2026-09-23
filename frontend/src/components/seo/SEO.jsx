import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://agrolink.co.ke';

const SEO = ({
  title = 'AgroLink Kenya - Fresh Farm Products Direct from Farmers',
  description = 'Buy fresh farm products directly from Kenyan farmers. Vegetables, fruits, grains, dairy, livestock, farm inputs, seeds, and tools delivered to your door.',
  canonical = SITE_URL,
  image = `${SITE_URL}/og-image.jpg`,
  type = 'website',
  keywords = 'farm, kenya, agriculture, farmers, fresh produce, vegetables, fruits, grains, dairy, livestock, farm inputs, seeds, tools',
  noindex = false,
  structuredData = null,
  breadcrumbs = null,
}) => {
  const fullTitle = title.includes('AgroLink') ? title : `${title} | AgroLink Kenya`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="AgroLink Kenya" />
      <meta property="og:locale" content="en_KE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}

      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.label,
              item: item.url,
            })),
          })}
        </script>
      )}
    </Helmet>
  );
};

export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AgroLink Kenya',
  description: 'Connecting agricultural producers directly with buyers in Kenya',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+254-700-000-000',
    contactType: 'customer service',
    areaServed: 'KE',
    availableLanguage: ['en', 'sw'],
  },
  sameAs: [
    'https://twitter.com/agrolinkke',
    'https://facebook.com/agrolinkke',
    'https://instagram.com/agrolinkke',
  ],
};

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AgroLink Kenya',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/products?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default SEO;
