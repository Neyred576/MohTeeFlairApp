import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BeautyTipsScreen from '../screens/BeautyTipsScreen';
import { Colors } from '../constants/Theme';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const TabIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => {
    const scale = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1.15 : 1,
            useNativeDriver: true,
            friction: 5,
            tension: 60,
        }).start();
    }, [focused]);

    const renderPath = () => {
        switch (name) {
            case 'Home':
                return <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color} />;
            case 'Shop':
                return <Path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-8-2h4v2h-4V4zm8 15H4V8h16v11z" fill={color} />;
            case 'Cart':
                return <Path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill={color} />;
            case 'Profile':
                return <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={color} />;
            case 'Beauty':
                return <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" fill={color} />;
            default:
                return null;
        }
    };

    return (
        <Animated.View style={[styles.iconWrapper, { transform: [{ scale }] }]}>
            {focused && <View style={styles.activeCircle} />}
            <Svg width="20" height="20" viewBox="0 0 24 24" style={styles.icon}>
                {renderPath()}
            </Svg>
        </Animated.View>
    );
};

const TabLabel = ({ name, focused }: { name: string; focused: boolean }) => (
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {name}
    </Text>
);

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.tabBarOuter, { paddingBottom: insets.bottom + 8 }]}>
            <View style={styles.tabBarInner}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                    };
                    const color = isFocused ? Colors.primary : Colors.muted;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.8}
                        >
                            <TabIcon name={route.name} color={color} focused={isFocused} />
                            <TabLabel name={route.name} focused={isFocused} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const TabNavigator = () => (
    <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Shop" component={ShopScreen} />
        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen name="Beauty" component={BeautyTipsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
    tabBarOuter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 8,
        backgroundColor: 'rgba(14,12,12,0.97)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    tabBarInner: {
        flexDirection: 'row',
        paddingHorizontal: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        gap: 4,
    },
    iconWrapper: {
        width: 42,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    activeCircle: {
        position: 'absolute',
        width: 42,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(201,133,106,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.3)',
    },
    icon: { zIndex: 1 },
    tabLabel: {
        fontSize: 9,
        color: Colors.muted,
        letterSpacing: 0.5,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: Colors.primary,
        fontWeight: '700',
    },
});

export default TabNavigator;
