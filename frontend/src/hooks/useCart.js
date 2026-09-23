import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateCartQuantity, clearCart } from '../redux/slices/cartSlice';

export const useCart = () => {
    const dispatch = useDispatch();
    const { items, totalPrice, totalItems, isLoading } = useSelector((state) => state.cart);

    const addItem = (productId, quantity = 1, variantId) => {
        dispatch(addToCart({ productId, quantity, variantId }));
    };

    const removeItem = (productId, variantId) => {
        dispatch(removeFromCart({ productId, variantId }));
    };

    const updateItemQuantity = (productId, quantity, variantId) => {
        dispatch(updateCartQuantity({ productId, quantity, variantId }));
    };

    const clearAllItems = () => {
        dispatch(clearCart());
    };

    return {
        items,
        totalPrice,
        totalItems,
        isLoading,
        addItem,
        removeItem,
        updateItemQuantity,
        clearAllItems
    };
};
