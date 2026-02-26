import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="cart-item">
            <img src={item.image || '/placeholder.jpg'} alt={item.name} />
            <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>${item.price}</p>
            </div>
            <div className="cart-item-actions">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                <button onClick={() => onRemove(item.id)}>Remove</button>
            </div>
        </div>
    );
};

export default CartItem;
