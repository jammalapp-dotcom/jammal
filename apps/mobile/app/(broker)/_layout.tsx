// ============================================================================
// JAMMAL — Broker Tab Navigator (Section 6.1)
// Tabs: Dashboard, Fleet, Customers, Earnings, Profile
// ============================================================================

import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';

export default function BrokerLayout() {
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
                    title: t('tabs.dashboard'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="fleet"
                options={{
                    title: t('tabs.fleet'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="customers"
                options={{
                    title: t('tabs.customers'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="business" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="earnings"
                options={{
                    title: t('tabs.earnings'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart" size={size} color={color} />
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
