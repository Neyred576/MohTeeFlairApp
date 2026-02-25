import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/Theme';

const SettingsScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuth();
    const [notificationsOn, setNotificationsOn] = useState(true);
    const [newsletterOn, setNewsletterOn] = useState(false);

    const handleLogout = async () => {
        await logout();
        // The AppNavigator will automatically unmount this stack
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Name</Text>
                            <Text style={styles.rowValue}>{user?.name || 'Guest'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Email</Text>
                            <Text style={styles.rowValue}>{user?.email || 'Not provided'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Phone</Text>
                            <Text style={styles.rowValue}>{user?.phone || 'Not provided'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Push Notifications</Text>
                            <Switch
                                value={notificationsOn}
                                onValueChange={setNotificationsOn}
                                trackColor={{ false: '#333', true: Colors.primary }}
                                thumbColor="#FFF"
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Email Newsletter</Text>
                            <Switch
                                value={newsletterOn}
                                onValueChange={setNewsletterOn}
                                trackColor={{ false: '#333', true: Colors.primary }}
                                thumbColor="#FFF"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.rowAction}>
                            <Text style={styles.rowLabel}>Privacy Policy</Text>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.rowAction}>
                            <Text style={styles.rowLabel}>Terms of Service</Text>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>App Version</Text>
                            <Text style={styles.rowValue}>1.0.0</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>{user?.isGuest ? 'Exit Guest Mode' : 'Log Out'}</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backBtn: {
        width: 40, height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtnText: { color: Colors.text, fontSize: 24, lineHeight: 28 },
    headerTitle: { fontSize: 18, color: Colors.text, fontFamily: 'serif', fontWeight: '500' },

    scrollContent: { padding: 20 },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 13, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 },
    card: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    rowAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    rowLabel: { fontSize: 15, color: Colors.text },
    rowValue: { fontSize: 14, color: Colors.muted },
    chevron: { fontSize: 18, color: Colors.muted },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

    logoutBtn: {
        backgroundColor: 'rgba(201,133,106,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(201,133,106,0.3)',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutText: { color: Colors.primary, fontSize: 15, fontWeight: '600', letterSpacing: 0.5 },
});

export default SettingsScreen;
