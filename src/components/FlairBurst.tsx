import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors } from '../constants/Theme';

interface ParticleProps {
    x: number;
    y: number;
    color: string;
}

const Particle = ({ x, y, color }: ParticleProps) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, (Math.random() - 0.5) * 100],
    });

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, (Math.random() - 0.5) * 100],
    });

    const scale = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1.2, 0],
    });

    const opacity = anim.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [1, 1, 0],
    });

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    backgroundColor: color,
                    left: x,
                    top: y,
                    transform: [
                        { translateX },
                        { translateY },
                        { scale }
                    ],
                    opacity
                }
            ]}
        />
    );
};

// We need a ref hook inside Particle actually, or just use the functional component correctly
import { useRef } from 'react';

export const FlairBurst = ({ x, y, onComplete }: { x: number, y: number, onComplete: () => void }) => {
    const [particles] = useState(() =>
        Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            color: Math.random() > 0.5 ? Colors.primary : '#331A10'
        }))
    );

    useEffect(() => {
        const timer = setTimeout(onComplete, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map((p) => (
                <Particle key={p.id} x={x} y={y} color={p.color} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    particle: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
    }
});

export default FlairBurst;
