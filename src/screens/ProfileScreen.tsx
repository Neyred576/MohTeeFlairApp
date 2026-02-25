import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, Animated, Easing, Image, Alert, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Theme';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const { width } = Dimensions.get('window');

const AVATAR_KEY = '@MHT_Avatar';

// ── Count-up hook ────────────────────────────────────────────────────────────
const useCountUp = (target: number, delay: number = 0) => {
    const [val, setVal] = useState(0);
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const listener = anim.addListener(({ value }) => setVal(Math.floor(value)));
        Animated.timing(anim, {
            toValue: target,
            duration: 1200,
            delay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
        return () => anim.removeListener(listener);
    }, [target]);
    return val;
};

// ── Menu Item ────────────────────────────────────────────────────────────────
const MenuItem = ({ title, icon, subtitle, index, onPress }: { title: string; icon: string; subtitle: string; index: number; onPress?: () => void }) => {
    const slideX = useRef(new Animated.Value(-20)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 450, delay: 500 + index * 80, useNativeDriver: true }),
            Animated.spring(slideX, { toValue: 0, friction: 8, delay: 500 + index * 80, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.menuItem, { opacity: fadeAnim, transform: [{ translateX: slideX }] }]}>
            <TouchableOpacity style={styles.menuItemInner} onPress={onPress} activeOpacity={0.75}>
                <View style={styles.menuIconBox}>
                    <Icon name={icon} size={20} color={Colors.primary} />
                </View>
                <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>{title}</Text>
                    <Text style={styles.menuSubtitle}>{subtitle}</Text>
                </View>
                <Icon name="chevron-forward" size={16} color="rgba(201,133,106,0.3)" />
            </TouchableOpacity>
        </Animated.View>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const ProfileScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuth();
    const { wishlist } = useWishlist();

    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    // Load saved avatar on mount
    useEffect(() => {
        AsyncStorage.getItem(AVATAR_KEY).then(uri => {
            if (uri) setAvatarUri(uri);
        });
    }, []);

    // Pick photo from gallery using react-native-image-picker if available, otherwise fallback
    const handleAvatarPress = async () => {
        try {
            // Try using react-native-image-picker
            const { launchImageLibrary } = require('react-native-image-picker');
            launchImageLibrary(
                {
                    mediaType: 'photo',
                    quality: 0.8,
                    maxWidth: 400,
                    maxHeight: 400,
                    includeBase64: false,
                },
                async (response: any) => {
                    if (response.didCancel || response.errorCode) return;
                    const asset = response.assets?.[0];
                    if (asset?.uri) {
                        setAvatarUri(asset.uri);
                        await AsyncStorage.setItem(AVATAR_KEY, asset.uri);
                    }
                }
            );
        } catch (e) {
            Alert.alert(
                'Photo Upload',
                'To enable profile photos, please install react-native-image-picker:\nnpm install react-native-image-picker',
                [{ text: 'OK' }]
            );
        }
    };

    // Real-time stats from context
    const ordersCount = user?.ordersCount ?? 0;
    const wishlistCount = wishlist.length;
    const reviewsCount = user?.reviewsCount ?? 0;
    const userPoints = user?.points || 0;

    // Progress bar
    const progressAnim = useRef(new Animated.Value(0)).current;
    const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

    // Profile card fade
    const cardFade = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(0.92)).current;

    // Avatar glow
    const glowAnim = useRef(new Animated.Value(1)).current;

    // Watermark float
    const watermarkY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Card in
        Animated.parallel([
            Animated.timing(cardFade, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.spring(cardScale, { toValue: 1, friction: 6, useNativeDriver: true }),
        ]).start();

        // Progress bar
        Animated.timing(progressAnim, {
            toValue: 0.72, duration: 2000, delay: 500,
            easing: Easing.out(Easing.exp), useNativeDriver: false,
        }).start();

        // Avatar glow pulse
        Animated.loop(Animated.sequence([
            Animated.timing(glowAnim, { toValue: 1.4, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(glowAnim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])).start();

        // Watermark float
        Animated.loop(Animated.sequence([
            Animated.timing(watermarkY, { toValue: -12, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(watermarkY, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Background glow + watermark */}
            <View style={styles.bgGlow} />
            <Animated.Text style={[styles.watermark, { transform: [{ translateY: watermarkY }] }]}>
                ♛
            </Animated.Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Profile Card */}
                <Animated.View style={[
                    styles.profileCard,
                    { marginTop: insets.top + 20, opacity: cardFade, transform: [{ scale: cardScale }] }
                ]}>
                    {/* Top row */}
                    <View style={styles.profileTop}>
                        {/* Avatar — tap to change photo */}
                        <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.85}>
                            <View style={styles.avatarWrapper}>
                                <Animated.View style={[styles.avatarGlowRing, { transform: [{ scale: glowAnim }] }]} />
                                <View style={styles.avatar}>
                                    {avatarUri ? (
                                        <Image
                                            source={{ uri: avatarUri }}
                                            style={styles.avatarPhoto}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Image
                                            source={require('../assets/logo/new_logo.png')}
                                            style={{ width: 52, height: 52 }}
                                            resizeMode="contain"
                                        />
                                    )}
                                </View>
                                {/* Camera badge */}
                                <View style={styles.cameraBadge}>
                                    <Icon name="camera" size={10} color={Colors.dark} />
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Info */}
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user?.name || 'Guest Explorer'}</Text>
                            {user?.email ? (
                                <Text style={styles.profileEmail}>{user.email}</Text>
                            ) : null}
                            <Text style={styles.profileTier}>{user?.isGuest ? 'Join For Rewards' : 'Gold Member ✦'}</Text>
                            <Text style={styles.profilePoints}>{userPoints} Crown Points</Text>
                        </View>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressArea}>
                        <View style={styles.progressLabels}>
                            <Text style={styles.progressLabel}>Gold ♛</Text>
                            <Text style={styles.progressLabel}>{Math.max(0, 3000 - userPoints)} pts → Platinum</Text>
                        </View>
                        <View style={styles.progressTrack}>
                            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                        </View>
                    </View>
                </Animated.View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {[
                        { val: ordersCount, label: 'Orders' },
                        { val: wishlistCount, label: 'Wishlist' },
                        { val: reviewsCount, label: 'Reviews' },
                    ].map((stat, i) => (
                        <View key={i} style={styles.statBox}>
                            <Text style={styles.statNum}>{stat.val}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu */}
                <View style={styles.menuSection}>
                    <MenuItem
                        index={0}
                        title="My Orders"
                        icon="cube-outline"
                        subtitle={ordersCount > 0 ? `${ordersCount} order${ordersCount > 1 ? 's' : ''}` : 'No orders yet'}
                        onPress={() => Alert.alert(
                            'My Orders',
                            ordersCount > 0
                                ? `You have ${ordersCount} order${ordersCount > 1 ? 's' : ''}. Order tracking coming soon!`
                                : 'You have no orders yet. Start shopping to see your orders here!',
                            [{ text: 'OK' }]
                        )}
                    />
                    <MenuItem
                        index={1}
                        title="Crown Rewards"
                        icon="ribbon-outline"
                        subtitle={`${userPoints} points available`}
                        onPress={() => Alert.alert(
                            'Crown Rewards ♛',
                            `You have ${userPoints} Crown Points.\n\n${Math.max(0, 3000 - userPoints)} more points to reach Platinum status!`,
                            [{ text: 'Awesome!' }]
                        )}
                    />
                    <MenuItem
                        index={2}
                        title="Beauty Profile"
                        icon="sparkles-outline"
                        subtitle="Skin type · preferences"
                        onPress={() => Alert.alert(
                            'Beauty Profile',
                            'Personalise your beauty profile — skin type, tone & preferences. Coming soon!',
                            [{ text: 'OK' }]
                        )}
                    />
                    <MenuItem
                        index={3}
                        title="Wishlist"
                        icon="heart-outline"
                        subtitle={wishlistCount > 0 ? `${wishlistCount} saved item${wishlistCount > 1 ? 's' : ''}` : 'Your saved items'}
                        onPress={() => navigation.navigate('Wishlist')}
                    />
                    <MenuItem
                        index={4}
                        title="Settings"
                        icon="settings-outline"
                        subtitle="Privacy · notifications"
                        onPress={() => navigation.navigate('Settings')}
                    />
                    <MenuItem
                        index={5}
                        title="Contact Us"
                        icon="call-outline"
                        subtitle="Support · Socials"
                        onPress={() => navigation.navigate('Contact')}
                    />
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={async () => {
                    await logout();
                }}>
                    <Text style={styles.logoutText}>{user?.isGuest ? 'Sign In / Register' : 'Log Out'}</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Version 1.2.8 · Moh Tee Flair</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark },
    bgGlow: {
        position: 'absolute',
        width: width,
        height: 300,
        top: 0,
        backgroundColor: 'rgba(201,133,106,0.06)',
        borderRadius: 0,
    },
    watermark: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        fontSize: 200,
        color: Colors.primary,
        opacity: 0.03,
    },

    // Profile card
    profileCard: {
        marginHorizontal: 20,
        borderRadius: 24,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.15)',
        padding: 20,
        overflow: 'hidden',
    },
    profileTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },

    // Avatar
    avatarWrapper: { width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
    avatarGlowRing: {
        position: 'absolute',
        width: 78,
        height: 78,
        borderRadius: 39,
        borderWidth: 2,
        borderColor: 'rgba(201,133,106,0.4)',
    },
    avatar: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: Colors.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarPhoto: {
        width: '100%',
        height: '100%',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.dark,
    },
    cameraIcon: { fontSize: 11 },

    profileInfo: { flex: 1, gap: 2 },
    profileName: { fontSize: 18, color: Colors.text, fontFamily: 'serif', letterSpacing: 1, fontWeight: '600' },
    profileEmail: { fontSize: 11, color: Colors.primaryLight, fontWeight: '400' },
    profileTier: { fontSize: 9, color: Colors.primaryLight, letterSpacing: 2, fontWeight: '600' },
    profilePoints: { fontSize: 11, color: Colors.muted, fontWeight: '500' },

    progressArea: { gap: 6 },
    progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
    progressLabel: { fontSize: 8, color: Colors.muted, letterSpacing: 1 },
    progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },

    // Stats
    statsGrid: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 16 },
    statBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
    },
    statNum: { fontSize: 28, color: Colors.text, fontFamily: 'serif', fontWeight: '300' },
    statLabel: { fontSize: 10, color: Colors.muted, marginTop: 2 },

    // Menu
    menuSection: { paddingHorizontal: 20, marginTop: 20, gap: 8 },
    menuItem: { borderRadius: 16, overflow: 'hidden' },
    menuItemInner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 14,
        gap: 12,
    },
    menuIconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(201,133,106,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: { fontSize: 18 },
    menuText: { flex: 1, gap: 2 },
    menuTitle: { fontSize: 12, color: Colors.text, fontWeight: '600' },
    menuSubtitle: { fontSize: 9, color: Colors.muted },
    menuArrow: { fontSize: 20, color: 'rgba(201,133,106,0.4)', lineHeight: 22 },

    // Logout
    logoutBtn: {
        alignSelf: 'center',
        marginTop: 24,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,75,75,0.3)',
        borderRadius: 20,
        paddingHorizontal: 30,
    },
    logoutText: { color: '#FF5252', fontSize: 14, fontWeight: '600' },
    version: { color: Colors.muted, fontSize: 10, textAlign: 'center', marginTop: 16, letterSpacing: 1 },
});

export default ProfileScreen;
