import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import { useCart } from '../context/CartContext';
import { Colors } from '../constants/Theme';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const PulseButton = ({ onPress, disabled, title }: { onPress: () => void, disabled: boolean, title: string }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!disabled) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.04, duration: 900, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [disabled]);

    return (
        <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%' }}>
            <TouchableOpacity
                style={[styles.checkoutButton, disabled && styles.disabledButton]}
                onPress={onPress}
                disabled={disabled}
                activeOpacity={0.8}
            >
                <Text style={styles.checkoutText}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const EmptyCartIcon = () => {
    const bobAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bobAnim, { toValue: -15, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(bobAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.emptyIconContainer, { transform: [{ translateY: bobAnim }] }]}>
            <Image source={require('../assets/logo/new_logo.png')} style={{ width: 60, height: 60, opacity: 0.5 }} resizeMode="contain" />
        </Animated.View>
    );
};

const CartScreen = ({ navigation }: any) => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const renderItem = (item: any) => (
        <View key={item.id + (item.size || '')} style={styles.cartItem}>
            <View style={styles.itemImageContainer}>
                <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category} {item.size ? `• ${item.size}` : ''}</Text>
                <Text style={styles.itemPrice}>Coming Soon</Text>
            </View>
            <View style={styles.itemActions}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => removeFromCart(item.id)}>
                    <Icon name="trash-outline" size={18} color="#FF4646" />
                </TouchableOpacity>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
                        <Icon name="remove" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
                        <Icon name="add" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={20} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>YOUR SHOPPING BAG</Text>
                <Image source={require('../assets/logo/new_logo.png')} style={{ width: 60, height: 60 }} resizeMode="contain" />
            </View>

            {/* Scrollable content + checkout button all inside ScrollView so button is always visible */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
            >
                {cartItems.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <EmptyCartIcon />
                        <Text style={styles.emptyText}>Your cart is currently empty</Text>
                        <TouchableOpacity style={styles.shopNowButton} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.shopNowText}>START SHOPPING</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.itemsList}>
                            {cartItems.map(renderItem)}
                        </View>

                        {/* Summary */}
                        <View style={styles.summaryContainer}>
                            <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Subtotal</Text>
                                <Text style={styles.summaryValue}>${getCartTotal().toFixed(2)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Delivery</Text>
                                <Text style={styles.summaryValue}>FREE</Text>
                            </View>
                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>TOTAL</Text>
                                <Text style={styles.totalValue}>${getCartTotal().toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* Checkout button INSIDE scroll — always fully visible */}
                        <View style={styles.checkoutSection}>
                            <PulseButton
                                title="PROCEED TO CHECKOUT →"
                                onPress={() => navigation.navigate('Checkout')}
                                disabled={cartItems.length === 0}
                            />
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
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
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: Colors.surface,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: Colors.border,
    },
    backIcon: { fontSize: 20, color: Colors.text },
    headerTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.text, letterSpacing: 2 },
    scrollContent: { padding: 20, paddingBottom: 100 },

    // Empty
    emptyContainer: { alignItems: 'center', paddingVertical: 100 },
    emptyIconContainer: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: Colors.surface,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 20, borderWidth: 1, borderColor: Colors.border,
    },
    emptyText: { fontSize: 16, color: Colors.gray, marginBottom: 30, letterSpacing: 1 },
    shopNowButton: { backgroundColor: Colors.primary, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 12 },
    shopNowText: { color: Colors.black, fontWeight: 'bold', letterSpacing: 1 },

    // Items
    itemsList: { marginBottom: 24 },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 20, padding: 15, marginBottom: 15,
        alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    },
    itemImageContainer: { width: 90, height: 90, borderRadius: 15, marginRight: 15, overflow: 'hidden' },
    itemImage: { width: '100%', height: '100%' },
    itemDetails: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
    itemCategory: { fontSize: 12, color: Colors.primary, marginBottom: 12, fontWeight: '500' },
    itemPrice: { fontSize: 14, fontWeight: '700', color: Colors.gray },
    itemActions: { alignItems: 'flex-end', justifyContent: 'space-between', height: 90 },
    deleteButton: { padding: 8 },
    deleteIcon: { fontSize: 16, color: '#FF4B4B' },
    quantityContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4,
        borderWidth: 1, borderColor: Colors.border,
    },
    qtyBtn: { width: 25, height: 25, justifyContent: 'center', alignItems: 'center' },
    qtyText: { fontSize: 18, color: Colors.primary, fontWeight: 'bold' },
    qtyValue: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginHorizontal: 12 },

    // Summary
    summaryContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 28, padding: 25,
        borderWidth: 1, borderColor: 'rgba(201, 133, 106, 0.12)',
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    summaryTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginBottom: 20, letterSpacing: 2 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    summaryLabel: { fontSize: 14, color: Colors.gray },
    summaryValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
    totalRow: { marginTop: 10, paddingTop: 20, borderTopWidth: 1, borderColor: Colors.border },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, letterSpacing: 2 },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },

    // Checkout section inside scroll
    checkoutSection: {
        marginBottom: 16,
    },
    checkoutButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    disabledButton: { opacity: 0.5, backgroundColor: Colors.surface },
    checkoutText: { color: Colors.black, fontSize: 15, fontWeight: 'bold', letterSpacing: 2 },
});

export default CartScreen;
