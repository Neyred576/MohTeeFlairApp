import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
    Dimensions, Animated, Easing, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Theme';
import { ALL_PRODUCTS, Product } from '../constants/Products';
import { SkeletonProduct } from '../components/SkeletonLoading';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

// ── Product Card ─────────────────────────────────────────────────────────────
import { GALLERY_PRODUCTS } from '../constants/Products';

const ProductCard = ({ item, index, navigation }: { item: Product; index: number; navigation: any }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.88)).current;
    const [wishlist, setWishlist] = useState(false);
    const heartScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 30, delay: index * 100, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 6, delay: index * 100, useNativeDriver: true }),
        ]).start();
    }, []);

    const toggleWishlist = () => {
        setWishlist(w => !w);
        Animated.sequence([
            Animated.spring(heartScale, { toValue: 1.6, friction: 3, useNativeDriver: true }),
            Animated.spring(heartScale, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();
    };

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(item, '1 unit');
    };

    return (
        <Animated.View style={[
            styles.productCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }
        ]}>
            <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
                activeOpacity={0.88}
            >
                {/* Image area */}
                <View style={styles.productImageBox}>
                    <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
                    {/* New badge */}
                    <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>New</Text>
                    </View>
                    {/* Wishlist */}
                    <TouchableOpacity style={styles.heartBtn} onPress={toggleWishlist} activeOpacity={0.8}>
                        <Animated.Text style={[styles.heartIcon, { transform: [{ scale: heartScale }] }]}>
                            {wishlist ? '❤️' : '♡'}
                        </Animated.Text>
                    </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.productSubtitle}>
                        {item.category}
                    </Text>
                    <Text style={styles.stars}>★★★★★</Text>
                    <View style={styles.productPriceRow}>
                        <Text style={styles.productPrice}>{item.price}</Text>
                        <TouchableOpacity style={styles.plusBtn} onPress={handleAddToCart}>
                            <Text style={styles.plusIcon}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const HomeScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const scrollY = useRef(new Animated.Value(0)).current;

    // Dynamic greeting calculation
    const [greeting, setGreeting] = useState('GOLD');
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('MORNING');
        else if (hour < 18) setGreeting('AFTERNOON');
        else setGreeting('EVENING');
    }, []);

    const userPoints = user?.points || 0;

    // Progress bar animation (membership card)
    const progressAnim = useRef(new Animated.Value(0)).current;
    const badgeScale = useRef(new Animated.Value(0.5)).current;

    const categories = ['All', 'Serum', 'Lips', 'Skin', 'Eyes', 'Sets'];

    // Logo Shimmer
    const shimmerAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);

        // Badge pop
        Animated.spring(badgeScale, { toValue: 1, friction: 4, tension: 50, delay: 500, useNativeDriver: true }).start();

        // Progress bar
        Animated.timing(progressAnim, {
            toValue: 0.72,
            duration: 2000,
            delay: 600,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
        }).start();

        // Shimmer loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 250,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: -100,
                    duration: 0,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // ── Search / filter logic ─────────────────────────────────────────────────
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const isSearching = trimmedQuery.length > 0;

    const filteredProducts = isSearching
        ? GALLERY_PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(trimmedQuery) ||
            p.category.toLowerCase().includes(trimmedQuery)
        )
        : GALLERY_PRODUCTS.slice(0, 4);

    return (
        <View style={styles.container}>
            {/* Rose-gold glow top-right */}
            <View style={styles.bgGlow} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <View>
                    <Text style={styles.headerGreeting}>GOOD {greeting} ✦</Text>
                    <Text style={styles.headerWelcome}>Welcome Back</Text>
                </View>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/logo/new_logo.png')}
                        style={styles.headerLogo}
                        resizeMode="contain"
                    />
                    {/* Shimmer overlay */}
                    <Animated.View style={[styles.shimmer, { transform: [{ translateX: shimmerAnim }] }]} />
                </View>
            </View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            >
                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search luxury beauty..."
                            placeholderTextColor={Colors.muted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            returnKeyType="search"
                        />
                        {isSearching && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Text style={styles.clearIcon}>✕</Text>
                            </TouchableOpacity>
                        )}
                        {!isSearching && (
                            <TouchableOpacity>
                                <Text style={styles.filterIcon}>⚙</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Royal Membership Card — hide while searching */}
                {!isSearching && (
                    <View style={styles.memberCard}>
                        {/* Background glow */}
                        <View style={styles.memberGlowOrb} />

                        <View style={styles.memberLeft}>
                            <Text style={styles.memberLabel}>{user?.isGuest ? 'GUEST EXPLORER' : 'ROYAL MEMBER'}</Text>
                            <Text style={styles.memberStatus}>{user?.isGuest ? 'Join For Points' : 'Gold Status ♛'}</Text>
                            <Text style={styles.memberPoints}>{userPoints} Crown Points</Text>
                        </View>
                        {/* Crown watermark */}
                        <Text style={styles.memberCrownBig}>♛</Text>

                        {/* Progress bar */}
                        <View style={styles.memberProgressArea}>
                            <View style={styles.memberProgressLabels}>
                                <Text style={styles.memberProgressLabelLeft}>{user?.isGuest ? 'Guest' : 'Gold'}</Text>
                                <Text style={styles.memberProgressLabelRight}>{Math.max(0, 3000 - userPoints)} pts to Platinum</Text>
                            </View>
                            <View style={styles.memberProgressTrack}>
                                <Animated.View style={[styles.memberProgressFill, { width: progressWidth }]} />
                            </View>
                        </View>
                    </View>
                )}

                {/* Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {isSearching ? `Results for "${searchQuery.trim()}"` : 'Our Collection'}
                    </Text>
                    {!isSearching && (
                        <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                            <Text style={styles.seeAll}>See All →</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Product Grid */}
                <View style={styles.productsGrid}>
                    {isLoading && !isSearching ? (
                        <View style={styles.gridRow}>
                            {Array.from({ length: 4 }).map((_, i) => <SkeletonProduct key={i} />)}
                        </View>
                    ) : filteredProducts.length === 0 ? (
                        <View style={styles.emptySearch}>
                            <Text style={styles.emptySearchEmoji}>🔍</Text>
                            <Text style={styles.emptySearchText}>No products found</Text>
                            <Text style={styles.emptySearchSub}>Try a different search term</Text>
                        </View>
                    ) : (
                        <View style={styles.gridRow}>
                            {filteredProducts.map((item, index) => (
                                <ProductCard key={item.id} item={item} index={index} navigation={navigation} />
                            ))}
                        </View>
                    )}
                </View>

                <View style={{ height: 120 }} />
            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.black },
    bgGlow: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: 'rgba(201,133,106,0.08)',
        top: -60,
        right: -60,
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingBottom: 16,
    },
    headerGreeting: {
        fontSize: 9,
        color: Colors.muted,
        letterSpacing: 2,
        fontWeight: '500',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    headerWelcome: {
        fontSize: 24,
        color: Colors.text,
        fontFamily: 'serif',
        fontWeight: '600',
    },
    logoContainer: {
        width: 110,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    headerLogo: {
        width: '100%',
        height: '100%',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 30,
        backgroundColor: 'rgba(255,255,255,0.4)',
        opacity: 0.6,
        transform: [{ skewX: '-20deg' }],
    },

    // Search
    searchSection: { paddingHorizontal: 22, marginBottom: 18 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    searchIcon: { fontSize: 15, marginRight: 8 },
    searchInput: { flex: 1, color: Colors.dark, fontSize: 14 },
    filterIcon: { fontSize: 16, color: Colors.muted },
    clearIcon: { fontSize: 14, color: Colors.muted, paddingHorizontal: 4 },

    // Membership Card
    memberCard: {
        marginHorizontal: 22,
        marginBottom: 20,
        height: 110,
        borderRadius: 20,
        backgroundColor: Colors.dark,
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.15)',
        padding: 16,
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    memberGlowOrb: {
        position: 'absolute',
        top: -40,
        right: -20,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(201,133,106,0.15)',
    },
    memberLeft: { gap: 2 },
    memberLabel: {
        fontSize: 8,
        color: Colors.muted,
        letterSpacing: 2,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    memberStatus: { fontSize: 16, color: Colors.primary, fontFamily: 'serif', fontWeight: '600' },
    memberPoints: { fontSize: 9, color: Colors.muted, fontWeight: '500' },
    memberCrownBig: {
        position: 'absolute',
        right: 14,
        top: 10,
        fontSize: 42,
        opacity: 0.1,
        color: Colors.primary,
    },
    memberProgressArea: { gap: 4 },
    memberProgressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
    memberProgressLabelLeft: { fontSize: 8, color: Colors.muted, letterSpacing: 1 },
    memberProgressLabelRight: { fontSize: 8, color: Colors.muted, letterSpacing: 0.5 },
    memberProgressTrack: {
        height: 4,
        backgroundColor: 'rgba(201,133,106,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    memberProgressFill: {
        height: '100%',
        borderRadius: 2,
        backgroundColor: Colors.primary,
    },

    // Categories
    categoryContent: { paddingHorizontal: 22, paddingBottom: 16, gap: 8 },
    categoryPill: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8DDD5',
    },
    activePill: { backgroundColor: Colors.dark, borderColor: Colors.dark },
    categoryText: { fontSize: 12, color: Colors.muted, fontWeight: '600' },
    activeCategoryText: { color: '#FFFFFF', fontWeight: '700' },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 22,
        marginBottom: 14,
    },
    sectionTitle: { fontSize: 20, color: Colors.text, fontFamily: 'serif', fontWeight: '500' },
    seeAll: { fontSize: 9, color: Colors.primary, letterSpacing: 1, fontWeight: '600' },

    // Empty search
    emptySearch: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptySearchEmoji: { fontSize: 48, marginBottom: 16 },
    emptySearchText: { fontSize: 18, color: Colors.text, fontWeight: '600', marginBottom: 6 },
    emptySearchSub: { fontSize: 13, color: Colors.muted },

    // Products
    productsGrid: { paddingHorizontal: 14 },
    gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    productCard: {
        width: (width / 2) - 20,
        backgroundColor: Colors.dark,
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    productImageBox: {
        width: '100%',
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    cardImage: { width: '100%', height: '100%' },
    newBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    newBadgeText: { fontSize: 7, color: '#FFFFFF', fontWeight: '700', letterSpacing: 0.5 },
    heartBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    heartIcon: { fontSize: 14, color: Colors.primary },
    productInfo: { padding: 10, gap: 3 },
    productName: { fontSize: 13, color: Colors.text, fontWeight: '700' },
    productSubtitle: { fontSize: 11, color: Colors.muted },
    stars: { fontSize: 10, color: Colors.primary, letterSpacing: 1 },
    productPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    productPrice: { fontSize: 22, color: Colors.primary, fontFamily: 'serif', fontWeight: '500' },
    plusBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.dark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: { color: '#FFFFFF', fontSize: 18, lineHeight: 20, fontWeight: '300' },
});

export default HomeScreen;
