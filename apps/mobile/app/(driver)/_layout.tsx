// ============================================================================
// JAMMAL — Driver Tab Navigator (Section 13.2)
// Tabs: Home/Map, Trips, Earnings, Availability, Profile
// ============================================================================

import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';

export default function DriverLayout() {
    const { t } = useTranslation();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.home'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="trips"
                options={{
                    title: t('tabs.trips'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="car" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="earnings"
                options={{
                    title: t('tabs.earnings'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cash" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="availability"
                options={{
                    title: t('tabs.availability'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="radio-button-on" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('tabs.profile'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
