import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';
import { Image } from 'expo-image';
import { useAlert } from '@/template';

export default function DriverEarningsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { driverWalletBalance, driverTransactions } = useApp();
  const { showAlert } = useAlert();

  const handleWithdraw = () => {
    const msg = '\u0627\u0644\u0631\u0635\u064a\u062f \u0627\u0644\u0645\u062a\u0627\u062d \u0644\u0644\u0633\u062d\u0628: ' + driverWalletBalance.toLocaleString() + ' \u0631.\u0633' +
      '\n\nIBAN: SA00 0000 0000 0000 0000 0000' +
      '\n\n\u062e\u0627\u0635\u064a\u0629 \u0627\u0644\u0633\u062d\u0628 \u0627\u0644\u0641\u0648\u0631\u064a \u0633\u062a\u0643\u0648\u0646 \u0645\u062a\u0627\u062d\u0629 \u0642\u0631\u064a\u0628\u0627\u064b';
    showAlert('\u0633\u062d\u0628 \u0625\u0644\u0649 \u0627\u0644\u0628\u0646\u0643', msg);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 8 }}>
          <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 32, height: 32 }} contentFit="contain" />
          <Text style={[styles.pageTitle, { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }]}>{'\u0627\u0644\u0623\u0631\u0628\u0627\u062d'}</Text>
        </View>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <LinearGradient colors={[theme.accent, theme.accentDark]} style={styles.balanceCard}>
            <Text style={styles.bLabel}>{'\u0631\u0635\u064a\u062f \u0627\u0644\u0645\u062d\u0641\u0638\u0629'}</Text>
            <Text style={styles.bValue}>{driverWalletBalance.toLocaleString()} <Text style={{ fontSize: 20 }}>{'\u0631.\u0633'}</Text></Text>
            <View style={styles.bStatsRow}>
              <View style={styles.bStat}><Text style={styles.bStatVal}>{'\u0664\u066c\u0668\u0668\u0664'}</Text><Text style={styles.bStatLbl}>{'\u0631.\u0633 \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639'}</Text></View>
              <View style={styles.bStatDiv} />
              <View style={styles.bStat}><Text style={styles.bStatVal}>{'\u0661\u0665\u066a'}</Text><Text style={styles.bStatLbl}>{'\u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0645\u0646\u0635\u0629'}</Text></View>
            </View>
            <Pressable style={styles.withdrawBtn} onPress={handleWithdraw}>
              <MaterialIcons name="account-balance" size={18} color={theme.accent} />
              <Text style={styles.withdrawText}>{'\u0633\u062d\u0628 \u0625\u0644\u0649 \u0627\u0644\u0628\u0646\u0643 (IBAN)'}</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionTitle}>{'\u0633\u062c\u0644 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a'}</Text>
          <View style={styles.txCard}>
            {driverTransactions.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === 'earning' ? theme.successLight : tx.type === 'commission' ? theme.warningLight : theme.errorLight }]}>
                  <MaterialIcons name={tx.type === 'earning' ? 'arrow-downward' : tx.type === 'withdrawal' ? 'account-balance' : 'receipt'} size={18} color={tx.type === 'earning' ? theme.success : tx.type === 'commission' ? theme.warning : theme.error} />
                </View>
                <View style={{ flex: 1 }}><Text style={styles.txDesc}>{tx.descriptionAr}</Text><Text style={styles.txDate}>{tx.date}</Text></View>
                <Text style={[styles.txAmt, { color: tx.amount > 0 ? theme.success : theme.error }]}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {'\u0631.\u0633'}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  pageTitle: { fontSize: 28, fontWeight: '700', color: theme.textPrimary, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  balanceCard: { marginHorizontal: 16, borderRadius: 16, padding: 24, ...theme.shadows.cardElevated },
  bLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  bValue: { fontSize: 40, fontWeight: '700', color: '#FFF', marginTop: 4 },
  bStatsRow: { flexDirection: 'row', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  bStat: { flex: 1, alignItems: 'center' },
  bStatVal: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  bStatLbl: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  bStatDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  withdrawBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 12, borderRadius: 12 },
  withdrawText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 },
  txCard: { marginHorizontal: 16, backgroundColor: theme.surface, borderRadius: 16, padding: 16, ...theme.shadows.card },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  txIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txDesc: { fontSize: 14, fontWeight: '500', color: theme.textPrimary },
  txDate: { fontSize: 12, color: theme.textTertiary, marginTop: 2 },
  txAmt: { fontSize: 14, fontWeight: '700' },
});
