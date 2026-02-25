import React, { useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, Dimensions, Animated, Easing,
    TouchableOpacity, StatusBar, Image, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Theme';

const { width, height } = Dimensions.get('window');

const TIPS_DATA = [
    { id: '1', title: 'The Double Cleanse Method', icon: '✨', desc: 'Start with an oil-based cleanser to melt away makeup and SPF, followed by a water-based cleanser for a deeper, royal clean without stripping moisture.' },
    { id: '2', title: 'Hyaluronic Acid Secrets', icon: '💧', desc: 'Always apply hyaluronic acid on slightly damp skin. This ensures it draws moisture into your skin rather than pulling it out.' },
    { id: '3', title: 'Layering Skincare 101', icon: '🧴', desc: 'Apply products from thinnest to thickest consistency. Toner, then serum, then moisturizer, and always finish with your favorite facial oil last.' },
    { id: '4', title: 'Flawless Base Makeup', icon: '🎨', desc: 'For a truly seamless finish, mix a drop of serum or facial oil into your foundation. It grants an instant, radiant, glass-skin glow.' },
    { id: '5', title: 'Cooling Eye Depuff', icon: '🧊', desc: 'Keep your eye creams in the fridge. The cooling effect constricts blood vessels, instantly reducing morning puffiness and dark circles.' },
];

const BeautyTipsScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    // Animations
    const floatY = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const scaleIn = useRef(new Animated.Value(0.85)).current;
    const orb1Scale = useRef(new Animated.Value(1)).current;
    const orb2Scale = useRef(new Animated.Value(1)).current;

    // Sparkle dots
    const spark1 = useRef(new Animated.Value(0)).current;
    const spark2 = useRef(new Animated.Value(0)).current;
    const spark3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade + scale in
        Animated.parallel([
            Animated.timing(fadeIn, { toValue: 1, duration: 800, easing: Easing.out(Easing.exp), useNativeDriver: true }),
            Animated.spring(scaleIn, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();

        // Floating lipstick emoji
        Animated.loop(Animated.sequence([
            Animated.timing(floatY, { toValue: -18, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(floatY, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])).start();

        // Glow pulse on text
        Animated.loop(Animated.sequence([
            Animated.timing(glowAnim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(glowAnim, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])).start();

        // Orb breathe
        const breathe = (val: Animated.Value, dur: number) => {
            Animated.loop(Animated.sequence([
                Animated.timing(val, { toValue: 1.08, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(val, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])).start();
        };
        breathe(orb1Scale, 4500);
        breathe(orb2Scale, 6000);

        // Sparkle twinkle
        const twinkle = (val: Animated.Value, delay: number) => {
            Animated.loop(Animated.sequence([
                Animated.delay(delay),
                Animated.timing(val, { toValue: 1, duration: 600, easing: Easing.out(Easing.sin), useNativeDriver: true }),
                Animated.timing(val, { toValue: 0.2, duration: 600, easing: Easing.in(Easing.sin), useNativeDriver: true }),
            ])).start();
        };
        twinkle(spark1, 0);
        twinkle(spark2, 400);
        twinkle(spark3, 800);
    }, []);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

    // Stagger animation for tips
    const listScale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.spring(listScale, { toValue: 1, friction: 6, tension: 40, delay: 300, useNativeDriver: true }).start();
    }, []);

    const renderTipCard = ({ item, index }: any) => {
        return (
            <Animated.View style={[styles.tipCard, { transform: [{ scale: listScale }] }]}>
                <View style={styles.tipIconBox}>
                    <Text style={styles.tipIcon}>{item.icon}</Text>
                </View>
                <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>{item.title}</Text>
                    <Text style={styles.tipDesc} numberOfLines={3}>{item.desc}</Text>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Background orbs */}
            <Animated.View style={[styles.orb, styles.orb1, { transform: [{ scale: orb1Scale }] }]} />
            <Animated.View style={[styles.orb, styles.orb2, { transform: [{ scale: orb2Scale }] }]} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>‹</Text>
                </TouchableOpacity>
                <Image source={require('../assets/logo/new_logo.png')} style={{ width: 44, height: 44 }} resizeMode="contain" />
                <View style={{ width: 36 }} />
            </View>

            <View style={{ flex: 1, width: '100%' }}>
                <Animated.View style={{ opacity: fadeIn, paddingHorizontal: 20, paddingBottom: 10, paddingTop: 10 }}>
                    <Text style={styles.title}>Beauty Tips &{'\n'}Secrets</Text>
                    <Text style={styles.subtitle}>
                        Expert skincare routines, makeup tutorials, and exclusive beauty secrets — crafted just for you.
                    </Text>
                </Animated.View>

                <FlatList
                    data={TIPS_DATA}
                    keyExtractor={item => item.id}
                    renderItem={renderTipCard}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80, gap: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Bottom sparkles */}
            <View style={styles.bottomDots}>
                {[spark1, spark2, spark3].map((s, i) => (
                    <Animated.View key={i} style={[styles.dot, { opacity: s }]} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#060505',
        alignItems: 'center',
    },

    // Background orbs
    orb: { position: 'absolute', borderRadius: 300 },
    orb1: { width: 320, height: 320, top: -60, right: -60, backgroundColor: 'rgba(201,133,106,0.14)' },
    orb2: { width: 240, height: 240, bottom: 60, left: -60, backgroundColor: 'rgba(168,99,79,0.09)' },

    // Header
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
        justifyContent: 'center', alignItems: 'center',
    },
    backBtnText: { color: Colors.text, fontSize: 24, lineHeight: 28, marginLeft: -2 },
    headerTitle: {
        fontSize: 14, color: Colors.text,
        fontFamily: 'serif', letterSpacing: 4, fontWeight: '600',
    },

    // Main content
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        gap: 16,
    },
    sparkleRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
    sparkle: { fontSize: 14, color: Colors.primary },
    sparkleLarge: { fontSize: 22, color: Colors.primaryLight },

    heroEmoji: { fontSize: 80, marginVertical: 8 },

    comingSoonLabel: {
        fontSize: 11,
        color: Colors.primary,
        letterSpacing: 4,
        textTransform: 'uppercase',
        fontWeight: '600',
        textShadowColor: 'rgba(201,133,106,0.5)',
        textShadowRadius: 16,
        textShadowOffset: { width: 0, height: 0 },
    },
    title: {
        fontSize: 32,
        color: Colors.text,
        fontFamily: 'serif',
        fontWeight: '600',
        lineHeight: 38,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.muted,
        lineHeight: 22,
        marginBottom: 10,
    },

    // Tip Card Styles
    tipCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(20,12,8,0.7)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.3)',
        alignItems: 'center',
    },
    tipIconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(201,133,106,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.2)',
    },
    tipIcon: { fontSize: 24 },
    tipContent: { flex: 1 },
    tipTitle: { fontSize: 16, color: Colors.primaryLight, fontWeight: '600', marginBottom: 4, fontFamily: 'serif' },
    tipDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

    // Bottom dots
    bottomDots: { flexDirection: 'row', gap: 8, marginBottom: 40, position: 'absolute', bottom: 10 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});

export default BeautyTipsScreen;
