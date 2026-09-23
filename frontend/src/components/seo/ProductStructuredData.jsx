import React from 'react';
import { slugify } from '../../utils/slugify';

export const getProductStructuredData = (product) => {
  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'AgroLink Kenya',
    },
    offers: {
      '@type': 'Offer',
      url: `https://agrolink.co.ke/product/${product.id}/${slugify(product.name)}`,
      price: product.price,
      priceCurrency: 'KES',
      availability: product.is_active
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'AgroLink Kenya',
      },
    },
    ...(product.category && {
      category: product.category,
    }),
  };
};

export default getProductStructuredData;
