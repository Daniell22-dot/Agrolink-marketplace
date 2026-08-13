const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

let client;

if (process.env.USE_ELASTICSEARCH === 'false') {
    console.log(' Elasticsearch is disabled (USE_ELASTICSEARCH=false)');
    client = new Proxy({}, {
        get(target, prop) {
            if (prop === 'indices') {
                return {
                    exists: async () => false,
                    create: async () => { throw new Error('Elasticsearch disabled'); }
                };
            }
            return async () => {
                throw new Error('Elasticsearch disabled');
            };
        }
    });
} else {
    client = new Client({
        node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
        auth: {
            username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
            password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
        }
    });
}

module.exports = client;

