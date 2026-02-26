import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
    const { id } = useParams();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Product Details</h1>
            <p className="text-gray-600">Viewing details for product #{id}</p>
        </div>
    );
};

export default ProductDetailPage;
