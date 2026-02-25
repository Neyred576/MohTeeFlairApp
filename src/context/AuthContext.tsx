import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types ────────────────────────────────────────────────────────────────────
export interface User {
    name: string;
    email: string;
    phone: string;
    points: number;
    isGuest: boolean;
    ordersCount: number;
    reviewsCount: number;
}

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (userData: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
    loginAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
    addPoints: (amount: number) => Promise<void>;
    incrementOrders: () => Promise<void>;
    incrementReviews: () => Promise<void>;
}

const STORAGE_KEY = '@MHT_User';
const ACCOUNTS_KEY = '@MHT_Accounts'; // all registered accounts: { [email]: { passwordHash, userData } }

// ── Simple password hashing (SHA-like via char codes — no native crypto needed) ──
const hashPassword = (password: string): string => {
    let hash = 5381;
    for (let i = 0; i < password.length; i++) {
        hash = ((hash << 5) + hash) + password.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(36) + password.length.toString(36);
};

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then(data => {
                if (data) {
                    try {
                        setUser(JSON.parse(data));
                    } catch (e) {
                        console.error('Failed to parse user data from storage', e);
                    }
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const saveUser = async (u: User) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        setUser(u);
    };

    const getAccounts = async (): Promise<Record<string, { hash: string; userData: Omit<User, 'isGuest' | 'points' | 'ordersCount' | 'reviewsCount'> }>> => {
        const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
        if (!raw) return {};
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error('Failed to parse accounts data', e);
            return {};
        }
    };

    const saveAccounts = async (accounts: Record<string, any>) => {
        await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    };

    // ── Login ────────────────────────────────────────────────────────────────
    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const trimEmail = email.trim().toLowerCase();
        if (!trimEmail || !password) return { success: false, error: 'Please fill in all fields.' };
        if (!/\S+@\S+\.\S+/.test(trimEmail)) return { success: false, error: 'Please enter a valid email address.' };
        if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

        const accounts = await getAccounts();
        const account = accounts[trimEmail];
        if (!account) return { success: false, error: 'No account found with this email.' };
        if (account.hash !== hashPassword(password)) return { success: false, error: 'Incorrect password. Please try again.' };

        // Restore persisted user data, or create fresh session
        const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
        let existing: User | null = null;
        if (existingRaw) {
            try {
                existing = JSON.parse(existingRaw);
            } catch (e) {
                console.error('Failed to parse existing user session', e);
            }
        }
        // Only reuse if it's the same email
        if (!existing || existing.email !== trimEmail || existing.isGuest) {
            existing = {
                name: account.userData.name,
                email: account.userData.email,
                phone: account.userData.phone,
                points: 0,
                isGuest: false,
                ordersCount: 0,
                reviewsCount: 0,
            };
        } else {
            existing = { ...existing, isGuest: false };
        }
        await saveUser(existing);
        return { success: true };
    };

    // ── Register ─────────────────────────────────────────────────────────────
    const register = async (userData: { name: string; email: string; phone: string; password: string }): Promise<{ success: boolean; error?: string }> => {
        const trimEmail = userData.email.trim().toLowerCase();
        const trimName = userData.name.trim();
        const trimPhone = userData.phone.trim();

        if (!trimName || !trimEmail || !trimPhone || !userData.password) return { success: false, error: 'Please fill in all fields.' };
        if (trimName.length < 2) return { success: false, error: 'Please enter your full name.' };
        if (!/\S+@\S+\.\S+/.test(trimEmail)) return { success: false, error: 'Please enter a valid email address.' };
        if (!/^\+?[\d\s\-]{7,15}$/.test(trimPhone)) return { success: false, error: 'Please enter a valid phone number.' };
        if (userData.password.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };
        if (!/[A-Z]/.test(userData.password)) return { success: false, error: 'Password must contain at least one uppercase letter.' };
        if (!/[0-9]/.test(userData.password)) return { success: false, error: 'Password must contain at least one number.' };

        const accounts = await getAccounts();
        if (accounts[trimEmail]) return { success: false, error: 'An account with this email already exists. Please sign in.' };

        accounts[trimEmail] = {
            hash: hashPassword(userData.password),
            userData: { name: trimName, email: trimEmail, phone: trimPhone },
        };
        await saveAccounts(accounts);

        const newUser: User = {
            name: trimName,
            email: trimEmail,
            phone: trimPhone,
            points: 0,
            isGuest: false,
            ordersCount: 0,
            reviewsCount: 0,
        };
        await saveUser(newUser);
        return { success: true };
    };

    // ── Guest Login ───────────────────────────────────────────────────────────
    const loginAsGuest = async () => {
        const guestUser: User = { name: 'Guest Explorer', email: '', phone: '', points: 0, isGuest: true, ordersCount: 0, reviewsCount: 0 };
        await saveUser(guestUser);
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setUser(null);
    };

    // ── Points ────────────────────────────────────────────────────────────────
    const addPoints = async (amount: number) => {
        if (!user || user.isGuest) return;
        const updated = { ...user, points: user.points + amount };
        await saveUser(updated);
    };

    // ── Stats ─────────────────────────────────────────────────────────────────
    const incrementOrders = async () => {
        if (!user || user.isGuest) return;
        const updated = { ...user, ordersCount: user.ordersCount + 1 };
        await saveUser(updated);
    };

    const incrementReviews = async () => {
        if (!user || user.isGuest) return;
        const updated = { ...user, reviewsCount: user.reviewsCount + 1 };
        await saveUser(updated);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, loginAsGuest, logout, addPoints, incrementOrders, incrementReviews }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
