import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { ChatMessage } from '../../services/mockData';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { getChatMessages, sendChatMessage, getShipmentById } = useApp();
  const [text, setText] = useState('');
  const shipment = getShipmentById(id || '');
  const messages = getChatMessages(id || '');

  const handleSend = () => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendChatMessage(id || '', user?.id || '', user?.name || '', text.trim());
    setText('');
  };

  const renderMessage = ({ item: msg }: { item: ChatMessage }) => (
    <View style={[styles.msgRow, msg.isMe && styles.msgRowMe]}>
      <View style={[styles.msgBubble, msg.isMe ? styles.bubbleMe : styles.bubbleOther]}>
        {!msg.isMe && <Text style={styles.msgSender}>{msg.senderName}</Text>}
        <Text style={[styles.msgText, msg.isMe && { color: '#FFF' }]}>{msg.text}</Text>
        <Text style={[styles.msgTime, msg.isMe && { color: 'rgba(255,255,255,0.6)' }]}>{new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.hBtn}><MaterialIcons name="arrow-forward" size={24} color={theme.textPrimary} /></Pressable>
        <View style={styles.hCenter}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 24, height: 24 }} contentFit="contain" />
            <Text style={styles.hTitle}>{shipment?.driverNameAr || 'محادثة'}</Text>
          </View>
          <Text style={styles.hSub}>{shipment?.id || ''}</Text>
        </View>
        <View style={styles.hBtn} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {messages.length === 0 ? (
          <View style={styles.empty}><MaterialIcons name="chat-bubble-outline" size={48} color={theme.textTertiary} /><Text style={styles.emptyText}>ابدأ المحادثة مع السائق</Text></View>
        ) : (
          <View style={{ flex: 1 }}><FlashList data={messages} renderItem={renderMessage} estimatedItemSize={80} contentContainerStyle={{ padding: 16 }} inverted={false} /></View>
        )}

        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput style={styles.input} placeholder="اكتب رسالة..." placeholderTextColor={theme.textTertiary} value={text} onChangeText={setText} textAlign="right" />
          <Pressable style={[styles.sendBtn, !text.trim() && { opacity: 0.4 }]} onPress={handleSend}>
            <MaterialIcons name="send" size={22} color="#FFF" style={{ transform: [{ scaleX: -1 }] }} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.border },
  hBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  hCenter: { alignItems: 'center' },
  hTitle: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  hSub: { fontSize: 12, color: theme.textSecondary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 14, color: theme.textSecondary },
  msgRow: { marginBottom: 8, alignItems: 'flex-start' },
  msgRowMe: { alignItems: 'flex-end' },
  msgBubble: { maxWidth: '80%', borderRadius: 16, padding: 12, paddingBottom: 6 },
  bubbleMe: { backgroundColor: theme.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: theme.surface, borderBottomLeftRadius: 4, ...theme.shadows.card },
  msgSender: { fontSize: 12, fontWeight: '600', color: theme.accent, marginBottom: 4 },
  msgText: { fontSize: 15, color: theme.textPrimary, lineHeight: 22 },
  msgTime: { fontSize: 10, color: theme.textTertiary, alignSelf: 'flex-end', marginTop: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 10, backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border },
  input: { flex: 1, backgroundColor: theme.background, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: theme.textPrimary, borderWidth: 1, borderColor: theme.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' },
});
