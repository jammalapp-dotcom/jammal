// جمّال - خدمات Supabase Realtime الموحدة
// تتبع السائق والدردشة عبر نفس القنوات في الويب والموبايل

import { getSupabase } from './supabase';
import { REALTIME_CHANNELS } from '@jammal/shared';
import type { ChatMessage, DriverLocation } from '@jammal/shared';

// ==================== الدردشة الحية ====================

/**
 * الاشتراك في رسائل شحنة معينة (Realtime)
 * يعمل بنفس الطريقة في الويب والموبايل
 */
export function subscribeToChat(
    shipmentId: string,
    onMessage: (message: ChatMessage) => void,
) {
    const supabase = getSupabase();
    const channelName = REALTIME_CHANNELS.shipmentChat(shipmentId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `shipment_id=eq.${shipmentId}`,
            },
            (payload) => {
                const msg = payload.new as any;
                onMessage({
                    id: msg.id,
                    shipmentId: msg.shipment_id,
                    senderId: msg.sender_id,
                    senderName: '', // يتم تعبئته من الـ UI
                    text: msg.text,
                    timestamp: msg.created_at,
                    isMe: false, // يتم تحديده في الـ UI
                });
            },
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

/**
 * إرسال رسالة في شحنة
 */
export async function sendMessage(shipmentId: string, senderId: string, text: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('messages')
        .insert({
            shipment_id: shipmentId,
            sender_id: senderId,
            text,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * جلب سجل الرسائل لشحنة
 */
export async function fetchChatHistory(shipmentId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

// ==================== تتبع السائق الحي ====================

/**
 * الاشتراك في تحديثات موقع السائق (Realtime)
 */
export function subscribeToDriverLocation(
    driverId: string,
    onLocationUpdate: (location: DriverLocation) => void,
) {
    const supabase = getSupabase();
    const channelName = REALTIME_CHANNELS.driverLocation(driverId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'users',
                filter: `id=eq.${driverId}`,
            },
            (payload) => {
                const user = payload.new as any;
                if (user.current_location) {
                    onLocationUpdate({
                        driverId: user.id,
                        latitude: user.current_location.coordinates?.[1] ?? 0,
                        longitude: user.current_location.coordinates?.[0] ?? 0,
                        timestamp: new Date().toISOString(),
                    });
                }
            },
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

/**
 * تحديث موقع السائق (يُستدعى من الموبايل فقط)
 */
export async function updateDriverLocation(
    driverId: string,
    latitude: number,
    longitude: number,
) {
    const supabase = getSupabase();
    // تحديث الموقع كـ PostGIS point
    const { error } = await supabase
        .from('users')
        .update({
            current_location: `POINT(${longitude} ${latitude})`,
        })
        .eq('id', driverId);

    if (error) throw error;
}

// ==================== تحديثات الشحنة ====================

/**
 * الاشتراك في تحديثات حالة شحنة (Realtime)
 */
export function subscribeToShipmentUpdates(
    shipmentId: string,
    onUpdate: (shipment: any) => void,
) {
    const supabase = getSupabase();
    const channelName = REALTIME_CHANNELS.shipmentUpdates(shipmentId);

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'shipments',
                filter: `id=eq.${shipmentId}`,
            },
            (payload) => {
                onUpdate(payload.new);
            },
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
