import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function Index() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={theme.accent} />
            </View>
        );
    }

    if (!isAuthenticated) return <Redirect href="/login" />;

    switch (user?.role) {
        case 'driver': return <Redirect href="/(driver)" />;
        case 'broker': return <Redirect href="/(broker)" />;
        case 'manager': return <Redirect href="/(manager)" />;
        default: return <Redirect href="/(customer)" />;
    }
}

const styles = StyleSheet.create({
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background },
});
