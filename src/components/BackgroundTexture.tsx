import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Rect, Defs, Filter, FeTurbulence, FeColorMatrix } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const BackgroundTexture = () => {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg height="100%" width="100%" opacity={0.15}>
                <Defs>
                    <Filter id="noise">
                        <FeTurbulence
                            type="fractalNoise"
                            baseFrequency="0.65"
                            numOctaves="3"
                            stitchTiles="stitch"
                        />
                        <FeColorMatrix
                            type="saturate"
                            values="0"
                        />
                    </Filter>
                </Defs>
                <Rect width="100%" height="100%" filter="url(#noise)" fill="transparent" />
            </Svg>
        </View>
    );
};

export default BackgroundTexture;
