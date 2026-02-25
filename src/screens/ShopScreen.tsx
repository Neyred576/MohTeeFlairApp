import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Image,
    Dimensions, Animated, Easing, FlatList, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Theme';
import { GALLERY_PRODUCTS, LIPS_PRODUCTS, Product } from '../constants/Products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const { width } = Dimensions.get('window');

// ── New Arrival Card ──────────────────────────────────────────────────────────
const ArrivalCard = ({ item, index, navigation }: { item: Product; index: number; navigation: any }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8, delay: index * 80, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.arrivalCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
                activeOpacity={0.85}
            >
                <View style={styles.arrivalImageArea}>
                    <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
                    <TouchableOpacity
                        style={styles.heartIconContainer}
                        onPress={() => isInWishlist(item.id) ? removeFromWishlist(item.id) : addToWishlist(item)}
                    >
                        <Text style={[styles.heartIcon, isInWishlist(item.id) && { color: '#FF4B4B' }]}>
                            {isInWishlist(item.id) ? '♥' : '♡'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.arrivalName} numberOfLines={1}>{item.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.arrivalPrice}>{item.price}</Text>
                    <TouchableOpacity
                        style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 6 }}
                        onPress={() => addToCart(item, '1 unit')}
                    >
                        <Text style={{ color: '#fff', fontSize: 18, lineHeight: 20 }}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const ShopScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { cartItems, addToCart } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Counter animation (0 → 28)
    const counterAnim = useRef(new Animated.Value(0)).current;
    const [counterVal, setCounterVal] = useState(0);

    // Orb breathe
    const orb1Scale = useRef(new Animated.Value(1)).current;
    const orb2Scale = useRef(new Animated.Value(1)).current;
    const orb3Scale = useRef(new Animated.Value(1)).current;

    // Floating emoji
    const floatY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Counter
        const listener = counterAnim.addListener(({ value }) => setCounterVal(Math.floor(value)));
        Animated.timing(counterAnim, { toValue: 28, duration: 1500, delay: 500, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();

        // Orb breathe
        const breathe = (val: Animated.Value, dur: number) => {
            Animated.loop(Animated.sequence([
                Animated.timing(val, { toValue: 1.05, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(val, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])).start();
        };
        breathe(orb1Scale, 4000);
        breathe(orb2Scale, 5500);
        breathe(orb3Scale, 8000);

        // Float emoji
        Animated.loop(Animated.sequence([
            Animated.timing(floatY, { toValue: -10, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(floatY, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])).start();

        return () => counterAnim.removeListener(listener);
    }, []);

    return (
        <View style={styles.container}>
            {/* Animated mesh background blobs */}
            <Animated.View style={[styles.meshBlob, styles.blob1, { transform: [{ scale: orb1Scale }] }]} />
            <Animated.View style={[styles.meshBlob, styles.blob2, { transform: [{ scale: orb2Scale }] }]} />
            <Animated.View style={[styles.meshBlob, styles.blob3, { transform: [{ scale: orb3Scale }] }]} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity style={styles.glassBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.glassBtnText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>COLLECTION</Text>
                <TouchableOpacity style={styles.glassBtn} onPress={() => navigation.navigate('Cart')}>
                    <Text style={styles.cartEmoji}>🛒</Text>
                    {cartItems.length > 0 && (
                        <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartItems.length}</Text></View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Featured Big Card */}
                <View style={styles.featuredCard}>
                    {/* Glow orb */}
                    <View style={styles.featuredGlowOrb} />

                    {/* Exclusive pill */}
                    <View style={styles.exclusivePill}>
                        <Text style={styles.exclusivePillText}>✦ Exclusive</Text>
                    </View>

                    {/* Counter */}
                    <View style={styles.featuredLeft}>
                        <Text style={styles.counterNumber}>{counterVal}</Text>
                        <Text style={styles.counterLabel}>Products</Text>
                        <Text style={styles.featuredDesc}>{'Luxury\nEssentials'}</Text>
                        <TouchableOpacity style={styles.shopNowBtn}>
                            <Text style={styles.shopNowText}>Shop Now →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Floating emoji */}
                    <Animated.Text style={[styles.featuredEmoji, { transform: [{ translateY: floatY }] }]}>
                        💆‍♀️
                    </Animated.Text>
                </View>

                {/* Tagline Replaces Trending */}
                <View style={styles.taglineContainer}>
                    <Text style={styles.taglineText}>Where Elegance Meets Aura</Text>
                </View>

                {/* New Arrivals */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>New Arrivals</Text>
                    <TouchableOpacity><Text style={styles.viewAll}>View All →</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.arrivalsContainer}>
                    {LIPS_PRODUCTS.map((item, index) => (
                        <ArrivalCard key={item.id} item={item} index={index} navigation={navigation} />
                    ))}
                </ScrollView>

                {/* Filter chips removed out, directly render Browse */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Browse All</Text>
                </View>

                <View style={styles.gridContainer}>
                    {GALLERY_PRODUCTS.map((item, index) => (
                        <View key={item.id} style={styles.gridCard}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ProductDetails', { product: item })}
                                activeOpacity={0.85}
                            >
                                <View style={styles.gridImageArea}>
                                    <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
                                    <TouchableOpacity
                                        style={styles.heartIconContainer}
                                        onPress={() => isInWishlist(item.id) ? removeFromWishlist(item.id) : addToWishlist(item)}
                                    >
                                        <Text style={[styles.heartIcon, isInWishlist(item.id) && { color: '#FF4B4B' }]}>
                                            {isInWishlist(item.id) ? '♥' : '♡'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.gridPrice}>{item.price}</Text>
                                    <TouchableOpacity
                                        style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 6 }}
                                        onPress={() => addToCart(item, '1 unit')}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 18, lineHeight: 20 }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark },

    // Background mesh
    meshBlob: {
        position: 'absolute',
        borderRadius: 300,
    },
    blob1: { width: 280, height: 280, top: 80, left: '5%', backgroundColor: 'rgba(201,133,106,0.12)' },
    blob2: { width: 200, height: 200, bottom: 180, right: '5%', backgroundColor: 'rgba(168,99,79,0.08)' },
    blob3: { width: 160, height: 160, top: 300, right: '20%', backgroundColor: 'rgba(242,208,196,0.05)' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    glassBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    glassBtnText: { color: Colors.text, fontSize: 24, lineHeight: 28, marginLeft: -2 },
    cartEmoji: { fontSize: 16 },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: { fontSize: 9, color: '#FFFFFF', fontWeight: '700' },
    headerTitle: {
        fontSize: 18,
        color: Colors.text,
        fontFamily: 'serif',
        letterSpacing: 3,
        fontWeight: '600',
    },

    // Featured card
    featuredCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        height: 190,
        borderRadius: 24,
        backgroundColor: 'rgba(20,12,8,0.9)',
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.2)',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    featuredGlowOrb: {
        position: 'absolute',
        top: -40,
        right: -20,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(201,133,106,0.15)',
    },
    exclusivePill: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(201,133,106,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    exclusivePillText: { fontSize: 9, color: Colors.primaryLight, fontWeight: '600', letterSpacing: 1 },
    featuredLeft: { flex: 1, gap: 4 },
    counterNumber: { fontSize: 56, color: Colors.primary, fontFamily: 'serif', fontWeight: '300', lineHeight: 60 },
    counterLabel: { fontSize: 9, color: Colors.muted, letterSpacing: 2, textTransform: 'uppercase' },
    featuredDesc: { fontSize: 20, color: Colors.text, fontFamily: 'serif', lineHeight: 26, marginTop: 4 },
    shopNowBtn: {
        alignSelf: 'flex-start',
        marginTop: 10,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 7,
    },
    shopNowText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
    featuredEmoji: { fontSize: 80, marginLeft: 8 },

    // Section headers
    sectionHeader: { paddingHorizontal: 20, marginBottom: 12 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12, marginTop: 20 },
    sectionTitle: { fontSize: 20, color: Colors.text, fontFamily: 'serif', fontWeight: '500' },
    viewAll: { fontSize: 9, color: Colors.primary, letterSpacing: 1, fontWeight: '600' },

    // Tagline
    taglineContainer: { paddingHorizontal: 20, marginVertical: 8 },
    taglineText: { fontSize: 13, color: Colors.primaryLight, letterSpacing: 2, fontStyle: 'italic', fontWeight: '500' },

    // Arrival cards
    arrivalsContainer: { paddingHorizontal: 20, paddingBottom: 4, gap: 12 },
    arrivalCard: {
        width: 130,
        backgroundColor: Colors.dark,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
        overflow: 'hidden',
    },
    arrivalImageArea: {
        height: 170, // Enlarged from 140
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    cardImage: { width: '100%', height: '100%' }, // Enlarged from 95%
    arrivalName: { fontSize: 13, color: Colors.text, fontWeight: '600', padding: 8, paddingBottom: 2 },
    arrivalPrice: { fontSize: 20, color: Colors.primary, fontFamily: 'serif', paddingHorizontal: 8, paddingBottom: 10 },



    // Grid
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 12, marginTop: 12 },
    gridCard: {
        width: (width / 2) - 22,
        backgroundColor: Colors.dark,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
        overflow: 'hidden',
    },
    gridImageArea: {
        height: 170, // Enlarged from 140
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    gridName: { fontSize: 13, color: Colors.text, fontWeight: '600', padding: 8, paddingBottom: 2 },
    gridPrice: { fontSize: 18, color: Colors.primary, fontFamily: 'serif', paddingHorizontal: 8, paddingBottom: 10 },
    heartIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    heartIcon: {
        fontSize: 18,
        color: '#FFFFFF',
    },
});

export default ShopScreen;
