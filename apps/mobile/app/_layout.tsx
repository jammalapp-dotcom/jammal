// ============================================================================
// JAMMAL — Mobile App Root Layout (expo-router)
// Handles auth state, locale, and role-based routing
// ============================================================================

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { View, ActivityIndicator, StyleSheet, I18nManager } from 'react-native';
import i18n from '../src/i18n';
import { useAuthStore } from '../src/stores/auth.store';
import { colors } from '../src/theme';

export default function RootLayout() {
    const [isReady, setIsReady] = useState(false);
    const { loadSession, isAuthenticated } = useAuthStore();

    useEffect(() => {
        async function init() {
            await loadSession();
            // Set RTL for Arabic
            const isRTL = i18n.language === 'ar';
            if (I18nManager.isRTL !== isRTL) {
                I18nManager.forceRTL(isRTL);
            }
            setIsReady(true);
        }
        init();
    }, []);

    if (!isReady) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <I18nextProvider i18n={i18n}>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
                {/* Auth screens */}
                <Stack.Screen name="(auth)" />
                {/* Role-based tab navigators */}
                <Stack.Screen name="(customer)" />
                <Stack.Screen name="(driver)" />
                <Stack.Screen name="(broker)" />
            </Stack>
        </I18nextProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1B365D',
    },
});
