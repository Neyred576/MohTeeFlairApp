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

const RegisterScreen = ({ navigation }: any) => {
    const { register } = useAuth();
    const insets = useSafeAreaInsets();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const orb1 = useRef(new Animated.ValueXY({ x: -width * 0.1, y: -height * 0.2 })).current;
    const orb2 = useRef(new Animated.ValueXY({ x: width * 0.25, y: height * 0.65 })).current;
    const fadeAnims = useRef([...Array(7)].map(() => new Animated.Value(0))).current;
    const slideAnims = useRef([...Array(7)].map(() => new Animated.Value(25))).current;
    const btnScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const floatOrb = (val: Animated.ValueXY, start: { x: number, y: number }, offset: { x: number, y: number }, dur: number) => {
            Animated.loop(Animated.sequence([
                Animated.timing(val, { toValue: { x: start.x + offset.x, y: start.y + offset.y }, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(val, { toValue: start, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])).start();
        };
        floatOrb(orb1, { x: -width * 0.1, y: -height * 0.2 }, { x: 80, y: 70 }, 11000);
        floatOrb(orb2, { x: width * 0.25, y: height * 0.65 }, { x: -60, y: -50 }, 13000);

        Animated.parallel(
            fadeAnims.map((fade, i) => Animated.parallel([
                Animated.timing(fade, { toValue: 1, duration: 500, delay: i * 80, useNativeDriver: true }),
                Animated.timing(slideAnims[i], { toValue: 0, duration: 600, delay: i * 80, easing: Easing.out(Easing.back(1.3)), useNativeDriver: true }),
            ]))
        ).start();
    }, []);

    const handleRegister = async () => {
        setErrorMsg('');
        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }
        setIsLoading(true);
        Animated.sequence([
            Animated.timing(btnScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }),
        ]).start();
        const result = await register({ name: fullName, email, phone, password });
        setIsLoading(false);
        if (!result.success) {
            setErrorMsg(result.error || 'Registration failed.');
        }
    };

    const fields = [
        { key: 'name', icon: 'user', placeholder: 'Full Name', value: fullName, onChange: setFullName, type: 'default' },
        { key: 'email', icon: 'mail', placeholder: 'Email Address', value: email, onChange: setEmail, type: 'email-address' },
        { key: 'phone', icon: 'phone', placeholder: 'Phone Number', value: phone, onChange: setPhone, type: 'phone-pad' },
    ];

    const checkStrength = (pass: string) => {
        let score = 0;
        if (pass.length > 5) score++;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };
    const strength = checkStrength(password);

    let strengthLabel = 'Weak';
    let strengthColor = '#FF5252';
    let strengthWidth = '25%';
    if (password.length === 0) {
        strengthLabel = '';
        strengthColor = 'transparent';
        strengthWidth = '0%';
    } else if (strength >= 4) {
        strengthLabel = 'Strong';
        strengthColor = '#00E676';
        strengthWidth = '100%';
    } else if (strength >= 3) {
        strengthLabel = 'Good';
        strengthColor = '#4CAF50';
        strengthWidth = '75%';
    } else if (strength === 2) {
        strengthLabel = 'Fair';
        strengthColor = '#FF9800';
        strengthWidth = '50%';
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={StyleSheet.absoluteFill}>
                <Animated.View style={[styles.orb, { width: 420, height: 420, backgroundColor: '#5C2800', opacity: 0.2, transform: orb1.getTranslateTransform() }]} />
                <Animated.View style={[styles.orb, { width: 380, height: 380, backgroundColor: '#C4873A', opacity: 0.14, transform: orb2.getTranslateTransform() }]} />
            </View>
            <View style={styles.overlay} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, width: '100%' }}>
                <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.backArrow}>‹</Text>
                        </View>
                    </TouchableOpacity>

                    <Animated.View style={[styles.headerSection, { opacity: fadeAnims[0], transform: [{ translateY: slideAnims[0] }] }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Image source={require('../assets/logo/new_logo.png')} style={{ width: 80, height: 80 }} resizeMode="contain" />
                            <View style={styles.secureBadge}>
                                <VectorIcon name="shield" size={12} color={Colors.primary} />
                                <Text style={styles.secureText}> Secure Registry</Text>
                            </View>
                        </View>
                        <Text style={styles.greeting}>Join the family</Text>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Start your Moh Tee Flair journey</Text>
                    </Animated.View>

                    <View style={styles.form}>
                        {fields.map((field, i) => (
                            <Animated.View key={field.key} style={{ opacity: fadeAnims[i + 1], transform: [{ translateY: slideAnims[i + 1] }] }}>
                                <Text style={styles.label}>{field.placeholder}</Text>
                                <View style={[styles.glassInput, isFocused === field.key && styles.inputFocused]}>
                                    <VectorIcon name={field.icon as any} size={18} color={isFocused === field.key ? Colors.primary : Colors.textMuted} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={field.placeholder}
                                        placeholderTextColor={Colors.textMuted}
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        onFocus={() => setIsFocused(field.key)}
                                        onBlur={() => setIsFocused(null)}
                                        keyboardType={field.type as any}
                                        autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                                    />
                                </View>
                            </Animated.View>
                        ))}

                        <Animated.View style={{ opacity: fadeAnims[4], transform: [{ translateY: slideAnims[4] }] }}>
                            <Text style={styles.label}>Password</Text>
                            <View style={[styles.glassInput, isFocused === 'password' && styles.inputFocused]}>
                                <VectorIcon name="lock" size={18} color={isFocused === 'password' ? Colors.primary : Colors.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min 8 chars, 1 uppercase, 1 number"
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

                        <Animated.View style={{ opacity: fadeAnims[5], transform: [{ translateY: slideAnims[5] }] }}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={[styles.glassInput, isFocused === 'confirm' && styles.inputFocused]}>
                                <VectorIcon name="lock" size={18} color={isFocused === 'confirm' ? Colors.primary : Colors.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Re-enter your password"
                                    placeholderTextColor={Colors.textMuted}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    onFocus={() => setIsFocused('confirm')}
                                    onBlur={() => setIsFocused(null)}
                                    secureTextEntry={!showConfirm}
                                />
                                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                    <VectorIcon name={showConfirm ? 'eye' : 'eye-off'} size={18} color={Colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        {/* Password strength meter */}
                        {password.length > 0 && (
                            <View style={styles.strengthContainer}>
                                <View style={styles.strengthBarBg}>
                                    <View style={[styles.strengthBarFill, { width: strengthWidth as any, backgroundColor: strengthColor }]} />
                                </View>
                                <Text style={[styles.strengthText, { color: strengthColor }]}>{strengthLabel}</Text>
                            </View>
                        )}

                        <View style={styles.hintBox}>
                            <Text style={[styles.hintText, password.length >= 8 && { color: '#4CAF50' }]}>
                                {password.length >= 8 ? '✓' : '○'} 8+ chars
                            </Text>
                            <Text style={[styles.hintText, /[A-Z]/.test(password) && { color: '#4CAF50' }]}>
                                {/[A-Z]/.test(password) ? '✓' : '○'} Uppercase
                            </Text>
                            <Text style={[styles.hintText, /[0-9]/.test(password) && { color: '#4CAF50' }]}>
                                {/[0-9]/.test(password) ? '✓' : '○'} Number
                            </Text>
                        </View>

                        {/* Error message */}
                        {!!errorMsg && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>⚠ {errorMsg}</Text>
                            </View>
                        )}

                        <Animated.View style={{ opacity: fadeAnims[5], transform: [{ translateY: slideAnims[5] }] }}>
                            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} activeOpacity={0.85}>
                                    <Text style={styles.registerBtnText}>{isLoading ? 'Creating...' : 'CREATE ACCOUNT'}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Animated.View>

                        <Animated.View style={[styles.footer, { opacity: fadeAnims[6], transform: [{ translateY: slideAnims[6] }] }]}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Sign In</Text>
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
    title: { fontSize: 34, color: Colors.text, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Optima' : 'serif', marginTop: 4 },
    subtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: 2 },
    form: { gap: 16 },
    label: { fontSize: 12, color: Colors.textSecondary, letterSpacing: 1, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
    glassInput: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.glass,
        borderWidth: 1, borderColor: Colors.glassBorder,
        borderRadius: 16, paddingHorizontal: 16, height: 58,
    },
    inputFocused: { borderColor: Colors.primary, backgroundColor: 'rgba(196, 135, 58, 0.1)' },
    input: { flex: 1, color: Colors.text, fontSize: 15, marginLeft: 12 },
    strengthContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, marginTop: -4 },
    strengthBarBg: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginRight: 12 },
    strengthBarFill: { height: '100%', borderRadius: 2 },
    strengthText: { fontSize: 11, fontWeight: '700', width: 45, textAlign: 'right' },
    hintBox: { backgroundColor: 'rgba(201,133,106,0.06)', borderRadius: 10, padding: 10, flexDirection: 'row', justifyContent: 'space-between' },
    hintText: { color: 'rgba(201,133,106,0.6)', fontSize: 11, fontWeight: '600' },
    errorBox: {
        backgroundColor: 'rgba(255, 75, 75, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 75, 75, 0.3)',
        borderRadius: 12,
        padding: 12,
    },
    errorText: { color: '#FF5252', fontSize: 12, fontWeight: '500' },
    registerBtn: {
        backgroundColor: Colors.primary,
        height: 60, borderRadius: 30,
        justifyContent: 'center', alignItems: 'center',
        marginTop: 10,
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
    },
    registerBtnText: { color: Colors.black, fontSize: 15, fontWeight: '900', letterSpacing: 2 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
    footerText: { color: Colors.textSecondary, fontSize: 14 },
    loginLink: { color: Colors.primary, fontSize: 14, fontWeight: 'bold' },
});

export default RegisterScreen;
