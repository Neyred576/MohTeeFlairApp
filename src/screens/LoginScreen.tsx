import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    Dimensions, KeyboardAvoidingView, Platform, Animated,
    Alert, StatusBar, ScrollView, Easing, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Theme';
import { useAuth } from '../context/AuthContext';
import VectorIcon from '../components/VectorIcon';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
    const { login } = useAuth();
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const orb1 = useRef(new Animated.ValueXY({ x: -width * 0.2, y: -height * 0.15 })).current;
    const orb2 = useRef(new Animated.ValueXY({ x: width * 0.35, y: height * 0.55 })).current;

    const fadeAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
    const slideAnims = useRef([...Array(5)].map(() => new Animated.Value(25))).current;
    const btnScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Orb float animation
        const floatOrb = (val: Animated.ValueXY, start: { x: number, y: number }, offset: { x: number, y: number }, dur: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(val, { toValue: { x: start.x + offset.x, y: start.y + offset.y }, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                    Animated.timing(val, { toValue: start, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                ])
            ).start();
        };
        floatOrb(orb1, { x: -width * 0.2, y: -height * 0.15 }, { x: 70, y: 60 }, 10000);
        floatOrb(orb2, { x: width * 0.35, y: height * 0.55 }, { x: -60, y: -50 }, 12000);

        // Stagger entrance
        const anims = fadeAnims.map((fade, i) =>
            Animated.parallel([
                Animated.timing(fade, { toValue: 1, duration: 500, delay: i * 80, useNativeDriver: true }),
                Animated.timing(slideAnims[i], { toValue: 0, duration: 600, delay: i * 80, easing: Easing.out(Easing.back(1.3)), useNativeDriver: true }),
            ])
        );
        Animated.parallel(anims).start();
    }, []);

    const handleLogin = async () => {
        setErrorMsg('');
        setIsLoading(true);
        Animated.sequence([
            Animated.timing(btnScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }),
        ]).start();

        const result = await login(email.trim().toLowerCase(), password);
        setIsLoading(false);
        if (!result.success) {
            setErrorMsg(result.error || 'Login failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Background Orbs */}
            <View style={StyleSheet.absoluteFill}>
                <Animated.View style={[styles.orb, { width: 380, height: 380, backgroundColor: '#C4873A', opacity: 0.15, transform: orb1.getTranslateTransform() }]} />
                <Animated.View style={[styles.orb, { width: 450, height: 450, backgroundColor: '#5C2800', opacity: 0.2, transform: orb2.getTranslateTransform() }]} />
            </View>
            <View style={styles.overlay} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, width: '100%' }}>
                <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                    {/* Back Button */}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.backArrow}>‹</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Header */}
                    <Animated.View style={[styles.headerSection, { opacity: fadeAnims[0], transform: [{ translateY: slideAnims[0] }] }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Image source={require('../assets/logo/new_logo.png')} style={{ width: 80, height: 80 }} resizeMode="contain" />
                            <View style={styles.secureBadge}>
                                <VectorIcon name="lock" size={12} color={Colors.primary} />
                                <Text style={styles.secureText}> Secure Login</Text>
                            </View>
                        </View>
                        <Text style={styles.greeting}>Welcome back</Text>
                        <Text style={styles.title}>Sign In</Text>
                        <Text style={styles.subtitle}>to Moh Tee Flair</Text>
                    </Animated.View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Email */}
                        <Animated.View style={{ opacity: fadeAnims[1], transform: [{ translateY: slideAnims[1] }] }}>
                            <Text style={styles.label}>Email</Text>
                            <View style={[styles.glassInput, isFocused === 'email' && styles.inputFocused]}>
                                <VectorIcon name="mail" size={18} color={isFocused === 'email' ? Colors.primary : Colors.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor={Colors.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setIsFocused('email')}
                                    onBlur={() => setIsFocused(null)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </Animated.View>

                        {/* Password */}
                        <Animated.View style={{ opacity: fadeAnims[2], transform: [{ translateY: slideAnims[2] }] }}>
                            <Text style={styles.label}>Password</Text>
                            <View style={[styles.glassInput, isFocused === 'password' && styles.inputFocused]}>
                                <VectorIcon name="lock" size={18} color={isFocused === 'password' ? Colors.primary : Colors.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={Colors.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setIsFocused('password')}
                                    onBlur={() => setIsFocused(null)}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <VectorIcon name={showPassword ? 'eye' : 'eye-off'} size={18} color={Colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        {/* Forgot */}
                        <Animated.View style={{ opacity: fadeAnims[2], transform: [{ translateY: slideAnims[2] }], alignItems: 'flex-end' }}>
                            <TouchableOpacity>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Error message */}
                        {!!errorMsg && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>⚠ {errorMsg}</Text>
                            </View>
                        )}

                        {/* Sign In Button */}
                        <Animated.View style={{ opacity: fadeAnims[3], transform: [{ translateY: slideAnims[3] }] }}>
                            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                                <TouchableOpacity style={styles.signInBtn} onPress={handleLogin} activeOpacity={0.85}>
                                    <Text style={styles.signInText}>{isLoading ? 'Signing In...' : 'SIGN IN'}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Animated.View>

                        {/* Footer */}
                        <Animated.View style={[styles.footer, { opacity: fadeAnims[4], transform: [{ translateY: slideAnims[4] }] }]}>
                            <Text style={styles.footerText}>New here? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.registerLink}>Create Account</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    orb: { position: 'absolute', borderRadius: 300 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 5, 1, 0.5)' },
    scroll: { paddingHorizontal: 28, paddingBottom: 50 },
    backBtn: { marginBottom: 30 },
    iconCircle: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.glass,
        borderWidth: 1, borderColor: Colors.glassBorder,
        justifyContent: 'center', alignItems: 'center',
    },
    backArrow: { color: Colors.text, fontSize: 26, lineHeight: 28, marginLeft: -3 },
    headerSection: { marginBottom: 30 },
    secureBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(201,133,106,0.1)',
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(201,133,106,0.4)',
    },
    secureText: { color: Colors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
    greeting: { fontSize: 14, color: Colors.primary, letterSpacing: 2, fontWeight: '600', textTransform: 'uppercase' },
    title: { fontSize: 38, color: Colors.text, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Optima' : 'serif', marginTop: 4 },
    subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 2 },
    form: { gap: 18 },
    label: { fontSize: 12, color: Colors.textSecondary, letterSpacing: 1, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
    glassInput: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.glass,
        borderWidth: 1, borderColor: Colors.glassBorder,
        borderRadius: 16, paddingHorizontal: 16, height: 58,
    },
    inputFocused: { borderColor: Colors.primary, backgroundColor: 'rgba(196, 135, 58, 0.1)' },
    input: { flex: 1, color: Colors.text, fontSize: 15, marginLeft: 12 },
    forgotText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
    errorBox: {
        backgroundColor: 'rgba(255, 75, 75, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 75, 75, 0.3)',
        borderRadius: 12,
        padding: 12,
    },
    errorText: { color: '#FF5252', fontSize: 12, fontWeight: '500' },
    signInBtn: {
        backgroundColor: Colors.primary,
        height: 60, borderRadius: 30,
        justifyContent: 'center', alignItems: 'center',
        marginTop: 10,
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
    },
    signInText: { color: Colors.black, fontSize: 15, fontWeight: '900', letterSpacing: 2.5 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { color: Colors.textSecondary, fontSize: 14 },
    registerLink: { color: Colors.primary, fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;
