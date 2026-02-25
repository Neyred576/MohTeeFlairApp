import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Colors } from '../constants/Theme';

const CheckoutScreen = ({ navigation }: any) => {
    const [address, setAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const handlePayment = () => {
        Alert.alert(
            "Inquiry Received",
            "Thank you! Our representative will contact you soon regarding your order.",
            [
                { text: "OK", onPress: () => navigation.navigate('MainTabs') }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CHECKOUT</Text>
                <Image source={require('../assets/logo/new_logo.png')} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Shipping Details</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter full address"
                        placeholderTextColor={Colors.gray}
                        value={address}
                        onChangeText={setAddress}
                        multiline
                    />
                </View>

                <Text style={styles.sectionTitle}>Payment Preference</Text>
                <Text style={styles.infoText}>As products are 'Coming Soon', our team will contact you for payment arrangements.</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Special Requests / Notes"
                        placeholderTextColor={Colors.gray}
                        multiline
                    />
                </View>

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Final Total</Text>
                        <Text style={styles.totalValue}>TBD</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                    <Text style={styles.payText}>CONFIRM INQUIRY</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: Colors.dark2,
        borderBottomWidth: 1,
        borderColor: Colors.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    backIcon: {
        fontSize: 20,
        color: Colors.text,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.text,
        letterSpacing: 2,
    },
    placeholderSpace: {
        width: 40,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 150,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 15,
        marginTop: 10,
        letterSpacing: 0.5,
    },
    infoText: {
        color: Colors.textSecondary,
        fontSize: 13,
        marginBottom: 20,
        lineHeight: 20,
    },
    inputContainer: {
        backgroundColor: Colors.surface,
        borderRadius: 15,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    input: {
        paddingVertical: 15,
        fontSize: 14,
        color: Colors.text,
    },
    summaryContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.dark2,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: Colors.border,
    },
    payButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    payText: {
        color: Colors.black,
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});

export default CheckoutScreen;
