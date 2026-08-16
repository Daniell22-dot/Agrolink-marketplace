import {
  PRODUCT_IMAGES,
  CATEGORY_DEFAULTS,
  DEFAULT_IMAGE
} from '../data/productImageCatalog';

const normalize = (value) => String(value || '').toLowerCase().trim();

const resolveCategoryKey = (category) => {
  const normalized = normalize(category);
  if (!normalized) return null;

  const aliases = {
    grains: ['grains', 'cereals', 'grain', 'grains & cereals', 'cereals & grains'],
    vegetables: ['vegetables', 'vegetable', 'greens', 'tubers'],
    fruits: ['fruits', 'fruit'],
    dairy: ['dairy', 'eggs', 'dairy & eggs', 'dairy and eggs'],
    meat: ['meat', 'poultry', 'fish', 'livestock', 'meat & poultry', 'meat and poultry'],
    herbs: ['herbs', 'spices', 'herbs & spices', 'herbs and spices', 'seasoning'],
    other: ['other', 'services', 'inputs', 'inputs & services', 'seeds', 'fertilizer']
  };

  for (const [key, values] of Object.entries(aliases)) {
    if (values.some((alias) => normalize(alias) === normalized)) return key;
  }
  return null;
};

// Returns an array of image URLs for a product (existing images win, else catalog)
const getProductImages = (product, fetchedCatalog = null) => {
  if (!product) return [DEFAULT_IMAGE];

  const existing =
    (product.images && product.images.length > 0 ? product.images : null) ||
    (product.image_url ? [product.image_url] : null) ||
    (product.image ? [product.image] : null);

  if (existing && existing.length > 0) {
    return existing;
  }

  const source = (fetchedCatalog && fetchedCatalog.products) || PRODUCT_IMAGES;

  const normalizedName = normalize(product.name || product.title);
  let bestEntry = null;
  let bestScore = 0;
  for (const entry of source) {
    for (const keyword of entry.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (!normalizedKeyword || normalizedKeyword.length < 3) continue;
      const nameWords = normalizedName.split(/\s+/);
      const isSubstringMatch =
        normalizedName.includes(normalizedKeyword) ||
        normalizedKeyword.includes(normalizedName);
      const isAllWordsMatch =
        nameWords.length > 1 && nameWords.every((word) => normalizedKeyword.includes(word));
      if (isSubstringMatch || isAllWordsMatch) {
        const score = normalizedKeyword.length * (isAllWordsMatch ? 2 : 1);
        if (score > bestScore) {
          bestScore = score;
          bestEntry = entry;
        }
      }
    }
  }
  if (bestEntry && bestEntry.images && bestEntry.images.length > 0) {
    return bestEntry.images;
  }

  const categoryKey = resolveCategoryKey(product.category || product.categoryId);
  const categorySource = (fetchedCatalog && fetchedCatalog.categories) || CATEGORY_DEFAULTS;
  if (categoryKey && categorySource[categoryKey] && categorySource[categoryKey].length > 0) {
    return categorySource[categoryKey];
  }

  return [DEFAULT_IMAGE];
};

// Returns a single display image URL
const resolveProductImage = (product, fetchedCatalog = null) => {
  const images = getProductImages(product, fetchedCatalog);
  return images[0] || DEFAULT_IMAGE;
};

export { resolveProductImage, getProductImages };
