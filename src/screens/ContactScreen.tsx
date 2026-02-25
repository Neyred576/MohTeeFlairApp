import React, { useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Dimensions, Animated, Linking, Platform, Image, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Theme';

const { width } = Dimensions.get('window');

const ContactScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleWebLink = () => {
        Linking.openURL('https://mohteeflair.netlify.app/');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:mohteeflair@gmail.com');
    };

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber.replace(/\s/g, '')}`);
    };

    const handleWhatsApp = (phoneNumber: string) => {
        const formattedNum = phoneNumber.replace(/\+/g, '').replace(/\s/g, '');
        const url = `whatsapp://send?phone=${formattedNum}`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Linking.openURL(`https://wa.me/${formattedNum}`);
            }
        });
    };

    const ContactItem = ({ title, value, icon, onPress, secondaryIcon, onSecondaryPress }: any) => (
        <View style={styles.contactCard}>
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{title}</Text>
                <TouchableOpacity onPress={onPress}>
                    <Text style={styles.cardValue}>{value}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
                    <Text style={styles.actionIcon}>{icon}</Text>
                </TouchableOpacity>
                {secondaryIcon && (
                    <TouchableOpacity style={[styles.actionBtn, styles.whatsappBtn]} onPress={onSecondaryPress}>
                        <Text style={styles.actionIcon}>{secondaryIcon}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Background Decor */}
            <View style={styles.bgCircle} />

            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CONTACT US</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/logo/new_logo.png')} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.brandName}>Moh Tee Flair</Text>
                        <Text style={styles.tagline}>Elegance Redefined</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Online Presence</Text>
                        <ContactItem
                            title="Official Website"
                            value="mohteeflair.netlify.app"
                            icon="🌐"
                            onPress={handleWebLink}
                        />
                        <ContactItem
                            title="Email Address"
                            value="mohteeflair@gmail.com"
                            icon="✉️"
                            onPress={handleEmail}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Get in Touch</Text>
                        <ContactItem
                            title="Primary Support (Kenya)"
                            value="+254 799 365 118"
                            icon="📞"
                            onPress={() => handleCall('+254 799 365 118')}
                            secondaryIcon="💬"
                            onSecondaryPress={() => handleWhatsApp('+254 799 365 118')}
                        />
                        <ContactItem
                            title="International (UAE)"
                            value="+971 526 413 089"
                            icon="📞"
                            onPress={() => handleCall('+971 526 413 089')}
                            secondaryIcon="💬"
                            onSecondaryPress={() => handleWhatsApp('+971 526 413 089')}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Follow Us</Text>
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Coming Soon', 'Our Instagram page is coming soon!')}>
                                <Text style={styles.socialIcon}>📸</Text>
                                <Text style={styles.socialLabel}>Instagram</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Coming Soon', 'Our TikTok channel is coming soon!')}>
                                <Text style={styles.socialIcon}>🎵</Text>
                                <Text style={styles.socialLabel}>TikTok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Coming Soon', 'Our Facebook page is coming soon!')}>
                                <Text style={styles.socialIcon}>👤</Text>
                                <Text style={styles.socialLabel}>Facebook</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.footerNote}>Our team is available 24/7 to assist you with your beauty needs.</Text>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark },
    bgCircle: {
        position: 'absolute',
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width * 0.75,
        backgroundColor: 'rgba(201,133,106,0.03)',
        top: -width * 0.5,
        left: -width * 0.25,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    backBtnText: { color: Colors.text, fontSize: 30, lineHeight: 34, marginTop: -4 },
    headerTitle: { fontSize: 16, color: Colors.text, fontFamily: 'serif', fontWeight: 'bold', letterSpacing: 2 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
    logoContainer: { alignItems: 'center', marginVertical: 40 },
    logo: { width: 100, height: 100, marginBottom: 15 },
    brandName: { fontSize: 24, color: Colors.primary, fontFamily: 'serif', fontWeight: 'bold', letterSpacing: 1 },
    tagline: { fontSize: 12, color: Colors.muted, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 },

    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 13, color: Colors.primaryLight, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 15, marginLeft: 5 },

    contactCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardInfo: { flex: 1, gap: 4 },
    cardTitle: { fontSize: 11, color: Colors.muted, letterSpacing: 0.5 },
    cardValue: { fontSize: 15, color: Colors.text, fontWeight: '600' },

    cardActions: { flexDirection: 'row', gap: 10 },
    actionBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(201,133,106,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.3)',
    },
    whatsappBtn: {
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        borderColor: 'rgba(37, 211, 102, 0.3)',
    },
    actionIcon: { fontSize: 20 },

    socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    socialBtn: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    socialIcon: { fontSize: 24, marginBottom: 6 },
    socialLabel: { fontSize: 10, color: Colors.muted, fontWeight: '500' },

    footerNote: { fontSize: 12, color: Colors.muted, textAlign: 'center', marginTop: 10, fontStyle: 'italic', lineHeight: 18 },
});

export default ContactScreen;
