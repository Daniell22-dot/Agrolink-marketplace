const {
    PRODUCT_IMAGES,
    CATEGORY_DEFAULTS,
    DEFAULT_IMAGE,
    getCatalog
} = require('../data/productImageCatalog');

// Maps Category slug/name to catalog category keys
const CATEGORY_ALIASES = {
    grains: ['grains', 'cereals', 'grain', 'grains & cereals', 'cereals & grains'],
    vegetables: ['vegetables', 'vegetable', 'greens', 'tubers'],
    fruits: ['fruits', 'fruit'],
    dairy: ['dairy', 'eggs', 'dairy & eggs', 'dairy and eggs'],
    meat: ['meat', 'poultry', 'fish', 'livestock', 'meat & poultry', 'meat and poultry'],
    herbs: ['herbs', 'spices', 'herbs & spices', 'herbs and spices', 'seasoning'],
    other: ['other', 'services', 'inputs', 'inputs & services', 'seeds', 'fertilizer']
};

const normalize = (value) => String(value || '').toLowerCase().trim();

const findCatalogEntry = (name) => {
    const normalizedName = normalize(name);
    if (!normalizedName) return null;

    let bestEntry = null;
    let bestScore = 0;

    for (const entry of PRODUCT_IMAGES) {
        for (const keyword of entry.keywords) {
            const normalizedKeyword = normalize(keyword);
            if (!normalizedKeyword || normalizedKeyword.length < 3) continue;

            const nameWords = normalizedName.split(/\s+/);
            const isSubstringMatch =
                normalizedName.includes(normalizedKeyword) ||
                normalizedKeyword.includes(normalizedName);
            const isAllWordsMatch = nameWords.length > 1 && nameWords.every(word => normalizedKeyword.includes(word));

            if (isSubstringMatch || isAllWordsMatch) {
                // Prefer longer/more specific keyword matches to avoid collisions
                // (e.g. "maize flour" must beat "maize", "steak" must not match "tea")
                const score = normalizedKeyword.length * (isAllWordsMatch ? 2 : 1);
                if (score > bestScore) {
                    bestScore = score;
                    bestEntry = entry;
                }
            }
        }
    }
    return bestEntry;
};

const resolveCategoryKey = (category) => {
    const normalized = normalize(category);
    if (!normalized) return null;

    for (const [key, aliases] of Object.entries(CATEGORY_ALIASES)) {
        if (aliases.some((alias) => normalize(alias) === normalized)) {
            return key;
        }
    }
    return null;
};

// Returns an array of image URLs for a product
const resolveImages = ({ name, category, uploadedImages }) => {
    if (uploadedImages && uploadedImages.length > 0) {
        return uploadedImages;
    }

    const entry = findCatalogEntry(name);
    if (entry) {
        return entry.images;
    }

    const categoryKey = resolveCategoryKey(category);
    if (categoryKey && CATEGORY_DEFAULTS[categoryKey]) {
        return CATEGORY_DEFAULTS[categoryKey];
    }

    return [DEFAULT_IMAGE];
};

// Returns a single image URL (for quick display)
const resolveImage = (product) => {
    const images = resolveImages(product);
    return images[0] || DEFAULT_IMAGE;
};

module.exports = {
    getCatalog,
    resolveImages,
    resolveImage,
    findCatalogEntry,
    resolveCategoryKey
};
