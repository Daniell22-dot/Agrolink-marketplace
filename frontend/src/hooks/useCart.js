import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';

export const useCart = () => {
    const dispatch = useDispatch();
    const { items, total, itemCount, loading } = useSelector((state) => state.cart);

    const addItem = (product, quantity = 1) => {
        dispatch(addToCart({ product, quantity }));
    };

    const removeItem = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const updateItemQuantity = (productId, quantity) => {
        dispatch(updateQuantity({ productId, quantity }));
    };

    const clearAllItems = () => {
        dispatch(clearCart());
    };

    return {
        items,
        total,
        itemCount,
        loading,
        addItem,
        removeItem,
        updateItemQuantity,
        clearAllItems
    };
};
