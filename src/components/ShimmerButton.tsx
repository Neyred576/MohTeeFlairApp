import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing, View, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../constants/Theme';
import Svg, { Rect, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

interface ShimmerButtonProps {
    onPress: (event: any) => void;
    title: string;
    style?: any;
    textStyle?: any;
}

const ShimmerButton = ({ onPress, title, style, textStyle }: ShimmerButtonProps) => {
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        const startShimmer = () => {
            shimmerAnim.setValue(-1);
            Animated.timing(shimmerAnim, {
                toValue: 2.5,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        };

        const interval = setInterval(startShimmer, 5000);
        startShimmer();

        return () => clearInterval(interval);
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [-1, 2.5],
        outputRange: [-300, 600],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.button, style]}
        >
            <View style={StyleSheet.absoluteFill}>
                <Animated.View
                    style={[
                        styles.shimmer,
                        { transform: [{ translateX }, { rotate: '25deg' }] }
                    ]}
                >
                    <Svg height="100%" width="100%">
                        <Defs>
                            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0" stopColor="white" stopOpacity="0" />
                                <Stop offset="0.5" stopColor="white" stopOpacity="0.2" />
                                <Stop offset="1" stopColor="white" stopOpacity="0" />
                            </SvgGradient>
                        </Defs>
                        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
                    </Svg>
                </Animated.View>
            </View>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    shimmer: {
        width: 200,
        height: '200%',
        position: 'absolute',
        top: '-50%',
    },
    text: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1.2,
    },
});

export default ShimmerButton;
