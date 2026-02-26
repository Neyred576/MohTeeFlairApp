import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
    Dimensions, Animated, Easing, Image, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Theme';
import { ALL_PRODUCTS, Product, GALLERY_PRODUCTS } from '../constants/Products';
import { SkeletonProduct } from '../components/SkeletonLoading';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';
import Reanimated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// ── Product Card ─────────────────────────────────────────────────────────────

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
                        <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                            <Icon
                                name={wishlist ? 'heart' : 'heart-outline'}
                                size={16}
                                color={wishlist ? '#FF4B4B' : Colors.primary}
                            />
                        </Animated.View>
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
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <Icon key={s} name="star" size={10} color={Colors.primary} />
                        ))}
                    </View>
                    <View style={styles.productPriceRow}>
                        <Text style={styles.productPrice}>{item.price}</Text>
                        <TouchableOpacity style={styles.plusBtn} onPress={handleAddToCart}>
                            <Icon name="add" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ── Featured Carousel Card ───────────────────────────────────────────────────
const FeaturedCard = ({ item, index, navigation }: any) => {
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.spring(scale, { toValue: 1, friction: 8, tension: 40, delay: index * 100, useNativeDriver: true }).start();
    }, []);

    return (
        <Animated.View style={[styles.featuredCard, { transform: [{ scale }] }]}>
            <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
                activeOpacity={0.9}
            >
                <Image source={item.image} style={styles.featuredImage} resizeMode="cover" />
                <View style={styles.featuredOverlay}>
                    <Text style={styles.featuredTag}>FLASH</Text>
                    <Text style={styles.featuredName}>{item.name}</Text>
                    <Text style={styles.featuredPrice}>{item.price}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ── Reanimated Parallax Member Card ───────────────────────────────────────────
const ReanimatedMemberCard = ({ user, userPoints, progressAnim, progressWidth }: any) => {
    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { perspective: 1000 },
                { rotateX: `${rotateX.value}deg` },
                { rotateY: `${rotateY.value}deg` },
            ],
        };
    });

    const handleTouch = (event: any) => {
        const { locationX, locationY } = event.nativeEvent;
        const centerX = (width - 44) / 2;
        const centerY = 55; // height/2
        rotateY.value = withSpring((locationX - centerX) / 10);
        rotateX.value = withSpring((centerY - locationY) / 5);
    };

    const handleRelease = () => {
        rotateX.value = withSpring(0);
        rotateY.value = withSpring(0);
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handleTouch}
            onPressOut={handleRelease}
        >
            <Reanimated.View style={[styles.memberCard, animatedStyle]}>
                <View style={styles.memberGlowOrb} />
                <View style={styles.memberLeft}>
                    <Text style={styles.memberLabel}>{user?.isGuest ? 'GUEST EXPLORER' : 'ROYAL MEMBER'}</Text>
                    <Text style={styles.memberStatus}>{user?.isGuest ? 'Join For Points' : 'Gold Status ♛'}</Text>
                    <Text style={styles.memberPoints}>{userPoints} Crown Points</Text>
                </View>
                <Icon name="ribbon" size={42} color={Colors.primary} style={styles.memberIconBig} />
                <View style={styles.memberProgressArea}>
                    <View style={styles.memberProgressLabels}>
                        <Text style={styles.memberProgressLabelLeft}>{user?.isGuest ? 'Guest' : 'Gold'}</Text>
                        <Text style={styles.memberProgressLabelRight}>{Math.max(0, 3000 - userPoints)} pts to Platinum</Text>
                    </View>
                    <View style={styles.memberProgressTrack}>
                        <Animated.View style={[styles.memberProgressFill, { width: progressWidth }]} />
                    </View>
                </View>
            </Reanimated.View>
        </TouchableOpacity>
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
                        <Icon name="search" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
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
                                <Icon name="close-circle" size={18} color={Colors.muted} />
                            </TouchableOpacity>
                        )}
                        {!isSearching && (
                            <TouchableOpacity>
                                <Icon name="options-outline" size={18} color={Colors.muted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Royal Membership Card — hide while searching */}
                {!isSearching && (
                    <ReanimatedMemberCard user={user} userPoints={userPoints} progressAnim={progressAnim} progressWidth={progressWidth} />
                )}

                {/* Featured Arrivals Horizontal Carousel — hide while searching */}
                {!isSearching && (
                    <View style={styles.featuredSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Featured Arrivals</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                                <Text style={styles.seeAll}>Explore Collection →</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={GALLERY_PRODUCTS.slice(4, 9)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingLeft: 22, paddingRight: 10 }}
                            renderItem={({ item, index }) => (
                                <FeaturedCard item={item} index={index} navigation={navigation} />
                            )}
                        />
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
    memberIconBig: {
        position: 'absolute',
        right: 14,
        top: 10,
        opacity: 0.15,
    },
    memberProgressArea: { gap: 4 },
    // ... rest of member styles ...

    // Featured Section
    featuredSection: { marginBottom: 25 },
    featuredCard: {
        width: 200,
        height: 140,
        marginRight: 15,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: Colors.dark,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    featuredImage: { width: '100%', height: '100%', opacity: 0.7 },
    featuredOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    featuredTag: { fontSize: 7, color: Colors.primary, fontWeight: '700', letterSpacing: 1.5, marginBottom: 2 },
    featuredName: { fontSize: 13, color: Colors.text, fontWeight: '600' },
    featuredPrice: { fontSize: 11, color: Colors.muted, marginTop: 1 },

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
    productInfo: { padding: 10, gap: 3 },
    productName: { fontSize: 13, color: Colors.text, fontWeight: '700' },
    productSubtitle: { fontSize: 11, color: Colors.muted },
    starsRow: { flexDirection: 'row', gap: 2, marginBottom: 2 },
    productPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    productPrice: { fontSize: 22, color: Colors.primary, fontFamily: 'serif', fontWeight: '500' },
    plusBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
