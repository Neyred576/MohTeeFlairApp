import React, { useRef } from 'react';
import { Animated, TouchableOpacity, View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { Colors } from '../constants/Theme';

interface BouncyButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    activeOpacity?: number;
}

const BouncyButton: React.FC<BouncyButtonProps> = ({ onPress, children, style, activeOpacity = 0.8 }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const rippleScale = useRef(new Animated.Value(0)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 0.95,
                useNativeDriver: true,
                friction: 4,
                tension: 100,
            }),
            Animated.timing(rippleOpacity, {
                toValue: 0.3,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(rippleScale, {
                toValue: 1.5,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                friction: 4,
                tension: 100,
            }),
            Animated.timing(rippleOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            rippleScale.setValue(0);
        });
    };

    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={[styles.buttonWrapper, style]}
        >
            <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
                <Animated.View
                    style={[
                        styles.ripple,
                        {
                            transform: [{ scale: rippleScale }],
                            opacity: rippleOpacity,
                        },
                    ]}
                />
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        overflow: 'hidden',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ripple: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        zIndex: 0,
    },
});

export default BouncyButton;
