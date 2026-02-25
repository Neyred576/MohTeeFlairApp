import React from 'react';
import {
    View, Text, StyleSheet, Dimensions, TouchableOpacity,
    StatusBar, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const IntroScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { loginAsGuest } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Background elements */}
            <View style={styles.bgLayer1} />
            <View style={styles.bgLayer2} />

            {/* Static Orbs for visual texture without animation overhead */}
            <View style={[
                styles.orb,
                { width: 300, height: 300, backgroundColor: 'rgba(201,133,106,0.15)', top: '-10%', right: '-15%' }
            ]} />
            <View style={[
                styles.orb,
                { width: 220, height: 220, backgroundColor: 'rgba(168,99,79,0.12)', bottom: '15%', left: '-15%' }
            ]} />
            <View style={[
                styles.orb,
                { width: 160, height: 160, backgroundColor: 'rgba(242,208,196,0.08)', top: '40%', right: '5%' }
            ]} />

            {/* Center Content */}
            <View style={[styles.centerSection, { paddingTop: insets.top + 40 }]}>
                {/* MTF Logo Image */}
                <View style={styles.logoWrapper}>
                    <Image
                        source={require('../assets/logo/new_logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Luxury tagline */}
                <Text style={styles.luxuryTag}>
                    LUXURY BEAUTY · REDEFINED
                </Text>

                {/* Subtitle */}
                <Text style={styles.subtitleText}>
                    Experience Royal Skincare
                </Text>
            </View>

            {/* Bottom Section */}
            <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 40 }]}>
                {/* Get Started button */}
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.primaryBtnText}>GET STARTED  →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => navigation.navigate('Register')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.secondaryBtnText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.guestBtn} onPress={() => loginAsGuest()}>
                    <Text style={styles.guestText}>Continue as Guest</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#060404',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bgLayer1: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#140C08',
        opacity: 0.8,
    },
    bgLayer2: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#2E1A10',
        opacity: 0.2,
    },
    orb: {
        position: 'absolute',
        borderRadius: 300,
    },

    // Center
    centerSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    logoWrapper: {
        width: 280,
        height: 280,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    divider: {
        height: 1,
        width: 200,
        backgroundColor: Colors.primary,
        opacity: 0.6,
        marginVertical: 12,
    },
    luxuryTag: {
        fontSize: 10,
        color: Colors.muted,
        letterSpacing: 4,
        textTransform: 'uppercase',
        fontFamily: 'sans-serif',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 18,
        color: Colors.primaryLight,
        fontFamily: 'serif',
        fontStyle: 'italic',
        letterSpacing: 1,
    },

    // Bottom
    bottomSection: {
        width: '100%',
        paddingHorizontal: 30,
        alignItems: 'center',
        gap: 16,
    },
    primaryBtn: {
        width: width - 60,
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.5)',
        paddingVertical: 16,
        borderRadius: 60,
        alignItems: 'center',
        backgroundColor: 'rgba(201,133,106,0.1)',
    },
    primaryBtnText: {
        color: Colors.primary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
    secondaryBtn: {
        width: width - 60,
        paddingVertical: 16,
        borderRadius: 60,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.2)',
        backgroundColor: 'rgba(201,133,106,0.04)',
    },
    secondaryBtnText: {
        color: Colors.primaryLight,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
    guestBtn: { paddingVertical: 10 },
    guestText: {
        color: Colors.muted,
        fontSize: 13,
        textDecorationLine: 'underline',
    },
});

export default IntroScreen;
