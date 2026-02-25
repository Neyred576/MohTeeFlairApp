import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../constants/Products';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const savedWishlist = await AsyncStorage.getItem('@wishlist');
            if (savedWishlist) {
                try {
                    setWishlist(JSON.parse(savedWishlist));
                } catch (e) {
                    console.error('Failed to parse wishlist data', e);
                }
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
        }
    };

    const saveWishlist = async (newWishlist: Product[]) => {
        try {
            await AsyncStorage.setItem('@wishlist', JSON.stringify(newWishlist));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    };

    const addToWishlist = (product: Product) => {
        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        saveWishlist(newWishlist);
    };

    const removeFromWishlist = (productId: string) => {
        const newWishlist = wishlist.filter(item => item.id !== productId);
        setWishlist(newWishlist);
        saveWishlist(newWishlist);
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item.id === productId);
    };

    const clearWishlist = () => {
        setWishlist([]);
        saveWishlist([]);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
