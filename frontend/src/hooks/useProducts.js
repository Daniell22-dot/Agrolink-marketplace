import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchProducts, fetchProductById } from '../redux/slices/productSlice';

export const useProducts = (filters = {}) => {
    const dispatch = useDispatch();
    const { products, currentProduct, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts(filters));
    }, [dispatch, JSON.stringify(filters)]);

    const getProductById = (id) => {
        dispatch(fetchProductById(id));
    };

    return {
        products,
        currentProduct,
        loading,
        error,
        getProductById
    };
};
