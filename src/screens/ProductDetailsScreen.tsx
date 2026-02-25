import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
    Dimensions, Animated, Easing, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/Theme';

const { width, height } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }: any) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { user, logout } = useAuth();
    const insets = useSafeAreaInsets();
    const [selectedShade, setSelectedShade] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const product = route.params?.product;

    // Animations
    const heroFade = useRef(new Animated.Value(0)).current;
    const imageFloat = useRef(new Animated.Value(0)).current;
    const imageRotate = useRef(new Animated.Value(-2)).current;
    const badgeScale = useRef(new Animated.Value(0)).current;
    // Content slide in
    const contentY = useRef(new Animated.Value(30)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;

    // Stars stagger
    const starScales = [0, 1, 2, 3, 4].map(() => useRef(new Animated.Value(0)).current);

    // Rings
    const ring1Rotate = useRef(new Animated.Value(0)).current;
    const ring2Rotate = useRef(new Animated.Value(0)).current;
    const ring3Rotate = useRef(new Animated.Value(0)).current;

    // Orb breathe
    const orbScale = useRef(new Animated.Value(1)).current;

    // Qty bounce
    const qtyBounce = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade hero
        Animated.timing(heroFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();

        // Float animation on product emoji
        Animated.loop(Animated.sequence([
            Animated.parallel([
                Animated.timing(imageFloat, { toValue: -10, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(imageRotate, { toValue: 2, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(imageFloat, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(imageRotate, { toValue: -2, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ]),
        ])).start();

        // Rings rotate
        Animated.loop(Animated.timing(ring1Rotate, { toValue: 1, duration: 12000, easing: Easing.linear, useNativeDriver: true })).start();
        Animated.loop(Animated.timing(ring2Rotate, { toValue: -1, duration: 8000, easing: Easing.linear, useNativeDriver: true })).start();
        Animated.loop(Animated.timing(ring3Rotate, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true })).start();

        // Orb breathe
        Animated.loop(Animated.sequence([
            Animated.timing(orbScale, { toValue: 1.15, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(orbScale, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])).start();

        // Badge pop
        Animated.spring(badgeScale, { toValue: 1, friction: 4, delay: 500, useNativeDriver: true }).start();

        // Content slide in
        Animated.parallel([
            Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
            Animated.spring(contentY, { toValue: 0, friction: 7, delay: 300, useNativeDriver: true }),
        ]).start();

        // Stars stagger
        starScales.forEach((s, i) => {
            Animated.spring(s, { toValue: 1, friction: 4, delay: 700 + i * 80, useNativeDriver: true }).start();
        });
    }, []);

    if (!product) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Product not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.errorBtn}>
                    <Text style={styles.errorBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const wishlistActive = isInWishlist(product.id);

    const ring1Interp = ring1Rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const ring2Interp = ring2Rotate.interpolate({ inputRange: [-1, 0], outputRange: ['-360deg', '0deg'] });
    const ring3Interp = ring3Rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const imgRotateInterp = imageRotate.interpolate({ inputRange: [-2, 2], outputRange: ['-2deg', '2deg'] });

    const handleAddToCart = () => {
        if (user?.isGuest) {
            Alert.alert(
                'Create an Account',
                'Please create an account to shop with Moh Tee Flair.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Create Account', onPress: async () => {
                            await logout();
                            navigation.reset({ index: 0, routes: [{ name: 'Intro' }] });
                        }
                    }
                ]
            );
            return;
        }

        addToCart(product, `1 unit`);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2200);
    };

    const bumpQty = (dir: 1 | -1) => {
        setQuantity(q => Math.max(1, q + dir));
        Animated.sequence([
            Animated.spring(qtyBounce, { toValue: 1.6, friction: 3, useNativeDriver: true }),
            Animated.spring(qtyBounce, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();
    };

    return (
        <View style={styles.container}>
            {/* ── HERO ────────────────────────────────────────────── */}
            <Animated.View style={[styles.hero, { opacity: heroFade }]}>
                {/* Orb */}
                <Animated.View style={[styles.heroOrb, { transform: [{ scale: orbScale }] }]} />

                {/* Rotating Rings */}
                <View style={styles.ringsContainer}>
                    <Animated.View style={[styles.ring, styles.ring1, { transform: [{ rotate: ring1Interp }] }]} />
                    <Animated.View style={[styles.ring, styles.ring2, { transform: [{ rotate: ring2Interp }] }]} />
                    <Animated.View style={[styles.ring, styles.ring3, { transform: [{ rotate: ring3Interp }] }]} />
                </View>

                {/* Product image floating */}
                <Animated.View style={[
                    styles.productImageWrapper,
                    { transform: [{ translateY: imageFloat }, { rotate: imgRotateInterp }] }
                ]}>
                    <Image
                        source={product.image}
                        style={styles.productHeroImage}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* Top overlay UI */}
                <View style={[styles.heroTopRow, { top: insets.top + 12 }]}>
                    <TouchableOpacity style={styles.glassBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.glassBtnText}>‹</Text>
                    </TouchableOpacity>
                    <Animated.View style={[styles.bestSellerPill, { transform: [{ scale: badgeScale }] }]}>
                        <Text style={styles.bestSellerText}>✦ Best Seller</Text>
                    </Animated.View>
                    <TouchableOpacity
                        style={[styles.glassBtn, wishlistActive && styles.glassBtnActive]}
                        onPress={() => wishlistActive ? removeFromWishlist(product.id) : addToWishlist(product)}
                    >
                        <Text style={styles.glassBtnText}>{wishlistActive ? '♥' : '♡'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom fade overlay */}
                <View style={styles.heroBottomFade} />
            </Animated.View>

            {/* ── SCROLLABLE CONTENT ────────────────────────────── */}
            <Animated.View style={[styles.scrollWrapper, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
                    {/* Category */}
                    <Text style={styles.categoryLabel}>{product.category} · Brightening</Text>

                    {/* Product Name */}
                    <Text style={styles.productName}>{product.name}</Text>

                    {/* Logo + reviews */}
                    <View style={styles.starsRow}>
                        <Animated.Image
                            source={require('../assets/logo/new_logo.png')}
                            style={[styles.brandStarLogo, { transform: [{ scale: starScales[0] }] }]}
                            resizeMode="contain"
                        />
                        <Text style={styles.ratingNum}>4.9</Text>
                        <View style={styles.reviewsPill}>
                            <Text style={styles.reviewsText}>238 reviews</Text>
                        </View>
                    </View>

                    {/* Description - Increased Font Size */}
                    <Text style={[styles.description, { fontSize: 13, lineHeight: 22, color: Colors.dark }]}>
                        {product.description || 'A luxurious formulation crafted to deliver radiant, glowing skin with every use. Enriched with 24K gold particles and Vitamin C.'}
                    </Text>

                    {/* The MTF Promise (Replaces Live Reviews) */}
                    <View style={styles.promiseContainer}>
                        <Text style={styles.promiseTitle}>The MTF Promise</Text>
                        <View style={styles.promiseRow}>
                            <View style={styles.promiseItem}>
                                <Text style={styles.promiseIcon}>🐰</Text>
                                <Text style={styles.promiseText}>Cruelty-Free</Text>
                            </View>
                            <View style={styles.promiseItem}>
                                <Text style={styles.promiseIcon}>✨</Text>
                                <Text style={styles.promiseText}>Premium Quality</Text>
                            </View>
                            <View style={styles.promiseItem}>
                                <Text style={styles.promiseIcon}>🛡️</Text>
                                <Text style={styles.promiseText}>Dermatologist Tested</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </Animated.View>

            {/* ── STICKY FOOTER ────────────────────────────────── */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                {/* Price + qty */}
                <View style={styles.footerLeft}>
                    <Text style={styles.footerPrice}>{product.price}</Text>
                    <View style={styles.qtyControl}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => bumpQty(-1)}>
                            <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Animated.Text style={[styles.qtyNum, { transform: [{ scale: qtyBounce }] }]}>
                            {quantity}
                        </Animated.Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => bumpQty(1)}>
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Add to cart */}
                <TouchableOpacity
                    style={[styles.addToCartBtn, addedToCart && styles.addedToCartBtn]}
                    onPress={handleAddToCart}
                    activeOpacity={0.85}
                >
                    <Text style={styles.addToCartText}>
                        {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.cream },
    errorContainer: { flex: 1, backgroundColor: Colors.dark, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: Colors.text, fontSize: 16, marginBottom: 16 },
    errorBtn: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
    errorBtnText: { color: '#fff', fontWeight: 'bold' },

    // Hero
    hero: {
        height: 300,
        backgroundColor: '#0A0706',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    heroOrb: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(201,133,106,0.12)',
    },
    ringsContainer: {
        position: 'absolute',
        width: 260,
        height: 260,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
        borderRadius: 200,
        borderWidth: 1,
    },
    ring1: { width: 260, height: 260, borderColor: 'rgba(201,133,106,0.10)' },
    ring2: { width: 200, height: 200, borderColor: 'rgba(201,133,106,0.07)' },
    ring3: { width: 140, height: 140, borderColor: 'rgba(201,133,106,0.10)' },
    productImageWrapper: {
        width: 250, // Enlarged from 180
        height: 250, // Enlarged from 180
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productHeroImage: {
        width: '100%',
        height: '100%',
    },
    heroTopRow: {
        position: 'absolute',
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 5,
    },
    glassBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    glassBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    glassBtnText: { color: Colors.text, fontSize: 20, lineHeight: 24, marginLeft: -2 },
    bestSellerPill: {
        backgroundColor: 'rgba(201,133,106,0.25)',
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.4)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    bestSellerText: { fontSize: 10, color: Colors.primary, fontWeight: '700', letterSpacing: 1 },
    heroBottomFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: Colors.cream,
        opacity: 0.6,
    },

    // Scrollable
    scrollWrapper: { flex: 1, paddingHorizontal: 22, paddingTop: 16 },
    categoryLabel: {
        fontSize: 10,
        color: Colors.primary,
        letterSpacing: 2,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    productName: {
        fontSize: 28,
        color: Colors.dark,
        fontFamily: 'serif',
        fontWeight: '500',
        lineHeight: 34,
        marginBottom: 12,
    },
    starsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
    brandStarLogo: { width: 65, height: 20, tintColor: Colors.primaryDark, marginLeft: -6 },
    star: { fontSize: 14, color: Colors.primary },
    ratingNum: { fontSize: 11, color: Colors.muted },
    reviewsPill: {
        marginLeft: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 20,
    },
    reviewsText: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
    description: { fontSize: 13, color: Colors.dark, lineHeight: 22, marginBottom: 24 },

    // The MTF Promise
    promiseContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.15)',
        alignItems: 'center',
        marginBottom: 20,
    },
    promiseTitle: {
        fontSize: 16,
        color: Colors.dark,
        fontFamily: 'serif',
        fontWeight: '600',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    promiseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    promiseItem: {
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 4,
    },
    promiseIcon: {
        fontSize: 22,
        marginBottom: 8,
    },
    promiseText: {
        fontSize: 10,
        color: Colors.muted,
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 14,
    },

    // Shade picker
    sectionLabel: { fontSize: 11, color: Colors.dark, fontWeight: '700', marginBottom: 12, letterSpacing: 0.5 },
    shadesRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
    shadeCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 2,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    shadeCircleSelected: { borderColor: Colors.dark, transform: [{ scale: 1.2 }] },
    shadeInner: { width: '100%', height: '100%', borderRadius: 16 },
    shadeCheck: {
        position: 'absolute',
        fontSize: 14,
        color: Colors.dark,
        fontWeight: '700',
    },

    // Ingredients
    ingredientsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    ingredientTag: {
        backgroundColor: Colors.warmWhite,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    ingredientText: { fontSize: 11, color: Colors.primaryDark, fontWeight: '600' },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0E8E0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingTop: 16,
        gap: 16,
    },
    footerLeft: { alignItems: 'flex-start', gap: 8 },
    footerPrice: { fontSize: 28, color: Colors.dark, fontFamily: 'serif', fontWeight: '500' },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.warmWhite,
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 12,
    },
    qtyBtn: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
    qtyBtnText: { fontSize: 18, color: Colors.primaryDark, fontWeight: '600' },
    qtyNum: { fontSize: 16, color: Colors.dark, fontWeight: '700', minWidth: 20, textAlign: 'center' },
    addToCartBtn: {
        flex: 1,
        backgroundColor: Colors.dark,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    addedToCartBtn: { backgroundColor: Colors.primary },
    addToCartText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
});

export default ProductDetailsScreen;
