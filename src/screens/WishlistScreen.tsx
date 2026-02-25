import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, Animated, SafeAreaView } from 'react-native';
import { useWishlist } from '../context/WishlistContext';
import { Colors } from '../constants/Theme';
import BackgroundTexture from '../components/BackgroundTexture';
import VectorIcon from '../components/VectorIcon';
import { Product } from '../constants/Products';

const { width } = Dimensions.get('window');

const WishlistScreen = ({ navigation }: any) => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const renderItem = ({ item, index }: { item: Product, index: number }) => (
        <Animated.View style={[styles.itemCard, { opacity: fadeAnim }]}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
                style={styles.itemInner}
            >
                <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
                <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromWishlist(item.id)}
                >
                    <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <BackgroundTexture />
            <SafeAreaView style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>YOUR WISHLIST</Text>
                <Image source={require('../assets/logo/new_logo.png')} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </SafeAreaView>

            {wishlist.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image source={require('../assets/logo/new_logo.png')} style={{ width: 80, height: 80, marginBottom: 20, opacity: 0.6 }} resizeMode="contain" />
                    <Text style={styles.emptyTitle}>Wishlist is empty</Text>
                    <Text style={styles.emptySubtitle}>Save your favorite items here!</Text>
                    <TouchableOpacity
                        style={styles.shopBtn}
                        onPress={() => navigation.navigate('Shop')}
                    >
                        <Text style={styles.shopBtnText}>CONTINUE SHOPPING</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={wishlist}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backText: {
        color: Colors.text,
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontFamily: 'serif',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    itemCard: {
        marginBottom: 15,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    itemInner: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemCategory: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    itemPrice: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
    removeBtn: {
        padding: 10,
    },
    removeText: {
        color: '#666',
        fontSize: 18,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 80,
        color: Colors.surface,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        color: Colors.text,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    shopBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 5,
    },
    shopBtnText: {
        color: Colors.black,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default WishlistScreen;
