import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/Theme';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
}

const SkeletonItem = ({ width, height, borderRadius = 8, style }: SkeletonProps) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    opacity,
                },
                style
            ]}
        />
    );
};

export const SkeletonProduct = () => {
    const cardWidth = Dimensions.get('window').width / 2 - 25;
    return (
        <View style={[styles.productCard, { width: cardWidth }]}>
            <SkeletonItem width="100%" height={180} borderRadius={15} />
            <View style={styles.details}>
                <SkeletonItem width="80%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                <SkeletonItem width="40%" height={12} borderRadius={4} />
            </View>
        </View>
    );
};

export const SkeletonCategory = () => {
    return (
        <SkeletonItem width={80} height={35} borderRadius={20} style={{ marginRight: 10 }} />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: 'rgba(184, 115, 90, 0.2)', // Muted copper
    },
    productCard: {
        marginBottom: 20,
        marginHorizontal: 5,
    },
    details: {
        marginTop: 12,
        paddingHorizontal: 5,
    }
});

export default SkeletonItem;
