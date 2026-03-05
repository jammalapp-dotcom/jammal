import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';

export default function RootLayout() {
    return (
        <AlertProvider>
            <SafeAreaProvider>
                <AuthProvider>
                    <AppProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="login" />
                            <Stack.Screen name="otp" />
                            <Stack.Screen name="(customer)" />
                            <Stack.Screen name="(driver)" />
                            <Stack.Screen name="(broker)" />
                            <Stack.Screen name="(manager)" />
                            <Stack.Screen name="shipment/[id]" options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
                            <Stack.Screen name="bids/[id]" options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
                            <Stack.Screen name="chat/[id]" options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
                            <Stack.Screen name="payment/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
                            <Stack.Screen name="notifications" options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
                        </Stack>
                    </AppProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </AlertProvider>
    );
}
