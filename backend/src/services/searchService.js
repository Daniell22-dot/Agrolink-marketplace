const client = require('../config/elasticsearch');

const INDEX_NAME = 'products';

// Create index if not exists
const createIndex = async () => {
    try {
        const exists = await client.indices.exists({ index: INDEX_NAME });
        if (!exists) {
            await client.indices.create({
                index: INDEX_NAME,
                body: {
                    mappings: {
                        properties: {
                            name: { type: 'text' },
                            description: { type: 'text' },
                            category: { type: 'keyword' },
                            price: { type: 'float' },
                            location: { type: 'geo_point' }, // simplified to string/text for now if no lat/lon
                            status: { type: 'keyword' },
                            createdAt: { type: 'date' }
                        }
                    }
                }
            });
            console.log(`Index ${INDEX_NAME} created`);
        }
    } catch (error) {
        console.warn('⚠️ Elasticsearch unavailable (will use database fallback)');
    }
};

createIndex();

exports.indexProduct = async (product) => {
    try {
        await client.index({
            index: INDEX_NAME,
            id: product.id.toString(),
            body: {
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category,
                price: parseFloat(product.price),
                quantity: product.quantity,
                unit: product.unit,
                location: product.location, // Assuming string for now
                images: product.images,
                status: product.status,
                farmerId: product.farmerId,
                createdAt: product.createdAt
            }
        });
    } catch (error) {
        console.error('Error indexing product:', error);
    }
};

exports.removeProduct = async (productId) => {
    try {
        await client.delete({
            index: INDEX_NAME,
            id: productId.toString()
        });
    } catch (error) {
        console.error('Error removing product from index:', error);
    }
};

exports.searchProducts = async (query) => {
    try {
        const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = query;
        const from = (page - 1) * limit;

        const must = [];
        const filter = [];

        // Term match for status
        filter.push({ term: { status: 'available' } });

        if (search) {
            must.push({
                multi_match: {
                    query: search,
                    fields: ['name', 'description'],
                    fuzziness: 'AUTO'
                }
            });
        } else {
            must.push({ match_all: {} });
        }

        if (category) {
            filter.push({ term: { category } });
        }

        if (minPrice || maxPrice) {
            const range = { price: {} };
            if (minPrice) range.price.gte = minPrice;
            if (maxPrice) range.price.lte = maxPrice;
            filter.push({ range });
        }

        const sortOptions = [];
        if (sort === 'price_asc') sortOptions.push({ price: 'asc' });
        else if (sort === 'price_desc') sortOptions.push({ price: 'desc' });
        else sortOptions.push({ createdAt: 'desc' });

        // Wrap in Promise.race with timeout
        const searchPromise = client.search({
            index: INDEX_NAME,
            body: {
                query: {
                    bool: {
                        must,
                        filter
                    }
                },
                sort: sortOptions,
                from,
                size: limit
            }
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Elasticsearch timeout')), 3000)
        );

        const result = await Promise.race([searchPromise, timeoutPromise]);

        const hits = result.hits.hits.map(hit => hit._source);
        const total = result.hits.total.value;

        return {
            success: true,
            count: total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: hits
        };

    } catch (error) {
        console.error('Elasticsearch search failed:', error.message);
        return null; // Return null to indicate fallback needed
    }
};
