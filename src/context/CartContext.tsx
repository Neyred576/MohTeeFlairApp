import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    category: string;
    price: string;
    priceValue: number;
    image: string;
    quantity: number;
    size?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: any, size: string) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: any, size: string) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id && item.size === size);
            if (existingItem) {
                return prev.map(item =>
                    (item.id === product.id && item.size === size)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            const priceValue = parseFloat(product.price.replace('$', ''));
            return [...prev, {
                id: product.id || Math.random().toString(),
                name: product.name,
                category: product.category,
                price: product.price,
                priceValue: priceValue,
                image: product.image,
                quantity: 1,
                size: size
            }];
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    const getCartTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
