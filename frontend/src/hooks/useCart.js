import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateCartQuantity, clearCart } from '../redux/slices/cartSlice';

export const useCart = () => {
    const dispatch = useDispatch();
    const { items, totalPrice, totalItems, isLoading } = useSelector((state) => state.cart);

    const addItem = (productId, quantity = 1) => {
        dispatch(addToCart({ productId, quantity }));
    };

    const removeItem = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const updateItemQuantity = (productId, quantity) => {
        dispatch(updateCartQuantity({ productId, quantity }));
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
