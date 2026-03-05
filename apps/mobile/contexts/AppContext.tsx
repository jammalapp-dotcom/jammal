// @ts-nocheck
// AppContext - إدارة حالة التطبيق - منقول من المشروع الأصلي
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shipment, Driver, Bid, WalletTransaction, ChatMessage, Notification, mockShipments, mockDrivers, mockBids, mockWalletTransactions, mockDriverTransactions, mockNotifications, AppUser } from '../services/mockData';

interface AppState {
    shipments: Shipment[]; drivers: Driver[]; bids: Bid[]; walletTransactions: WalletTransaction[];
    driverTransactions: WalletTransaction[]; notifications: Notification[]; chatMessages: ChatMessage[];
    walletBalance: number; driverWalletBalance: number; driverOnline: boolean;
    setDriverOnline: (v: boolean) => void; addShipment: (shipment: Shipment) => void;
    updateShipmentStatus: (id: string, status: Shipment['status']) => void;
    acceptBid: (shipmentId: string, bidId: string) => void;
    getShipmentBids: (shipmentId: string) => Bid[];
    getActiveShipments: () => Shipment[]; getShipmentById: (id: string) => Shipment | undefined;
    getDriverShipments: (driverId: string) => Shipment[]; getBrokerShipments: (brokerId: string) => Shipment[];
    sendChatMessage: (shipmentId: string, senderId: string, senderName: string, text: string) => void;
    getChatMessages: (shipmentId: string) => ChatMessage[];
    markNotificationRead: (id: string) => void; getUnreadNotifCount: () => number;
    processPayment: (shipmentId: string, method: string) => boolean;
    submitBid: (shipmentId: string, driver: Driver, amount: number, message: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
    const [drivers] = useState<Driver[]>(mockDrivers);
    const [bids, setBids] = useState<Bid[]>(mockBids);
    const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(mockWalletTransactions);
    const [driverTransactions, setDriverTransactions] = useState<WalletTransaction[]>(mockDriverTransactions);
    const [walletBalance, setWalletBalance] = useState(12450);
    const [driverWalletBalance, setDriverWalletBalance] = useState(8750);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [driverOnline, setDriverOnline] = useState(true);

    useEffect(() => { AsyncStorage.getItem('jammal_shipments_v2').then((data) => { if (data) { try { const parsed = JSON.parse(data); if (parsed.length > 0) setShipments(parsed); } catch { } } }); }, []);
    useEffect(() => { AsyncStorage.setItem('jammal_shipments_v2', JSON.stringify(shipments)); }, [shipments]);

    const addShipment = (shipment: Shipment) => setShipments((prev) => [shipment, ...prev]);

    const updateShipmentStatus = (id: string, status: Shipment['status']) => {
        setShipments((prev) => prev.map((s) => {
            if (s.id !== id) return s;
            const updated = { ...s, status };
            if (status === 'delivered') { updated.paymentStatus = 'released'; updated.trackingProgress = 1; }
            if (status === 'en_route') updated.trackingProgress = 0.3;
            if (status === 'pickup') updated.trackingProgress = 0.1;
            return updated;
        }));
    };

    const acceptBid = (shipmentId: string, bidId: string) => {
        const bid = bids.find((b) => b.id === bidId); if (!bid) return;
        setShipments((prev) => prev.map((s) => s.id === shipmentId ? { ...s, status: 'assigned' as const, finalPrice: bid.amount, driverName: bid.driver.name, driverNameAr: bid.driver.nameAr, driverRating: bid.driver.rating, driverPhone: bid.driver.phone, driverId: bid.driver.id, vehiclePlate: bid.driver.vehiclePlate, paymentStatus: 'authorized' as const } : s));
        const newTx: WalletTransaction = { id: `tx-${Date.now()}`, type: 'payment', amount: -bid.amount, description: `Shipment ${shipmentId}`, descriptionAr: `شحنة ${shipmentId}`, date: new Date().toISOString().split('T')[0], status: 'pending', shipmentId };
        setWalletTransactions((prev) => [newTx, ...prev]); setWalletBalance((prev) => prev - bid.amount);
    };

    const getShipmentBids = (shipmentId: string) => bids.filter((b) => b.shipmentId === shipmentId);
    const getActiveShipments = () => shipments.filter((s) => !['delivered', 'disputed', 'draft'].includes(s.status));
    const getShipmentById = (id: string) => shipments.find((s) => s.id === id);
    const getDriverShipments = (driverId: string) => shipments.filter((s) => s.driverId === driverId || s.driverName);
    const getBrokerShipments = (brokerId: string) => shipments.filter((s) => s.brokerId === brokerId);

    const sendChatMessage = (shipmentId: string, senderId: string, senderName: string, text: string) => {
        const msg: ChatMessage = { id: `msg-${Date.now()}`, shipmentId, senderId, senderName, text, timestamp: new Date().toISOString(), isMe: true };
        setChatMessages((prev) => [...prev, msg]);
        setTimeout(() => { setChatMessages((prev) => [...prev, { id: `msg-${Date.now()}-reply`, shipmentId, senderId: 'auto-reply', senderName: 'السائق', text: 'تم الاستلام، سأكون هناك قريباً إن شاء الله', timestamp: new Date().toISOString(), isMe: false }]); }, 2000);
    };

    const getChatMessages = (shipmentId: string) => chatMessages.filter((m) => m.shipmentId === shipmentId);
    const markNotificationRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const getUnreadNotifCount = () => notifications.filter((n) => !n.read).length;
    const processPayment = (shipmentId: string, method: string): boolean => { setShipments((prev) => prev.map((s) => s.id === shipmentId ? { ...s, paymentStatus: 'authorized', paymentMethod: method } : s)); return true; };

    const submitBid = (shipmentId: string, driver: Driver, amount: number, message: string) => {
        const newBid: Bid = { id: `bid-${Date.now()}`, shipmentId, driver, amount, estimatedArrival: '٣ ساعات', message, messageAr: message, createdAt: new Date().toISOString() };
        setBids((prev) => [...prev, newBid]);
        setShipments((prev) => prev.map((s) => (s.id === shipmentId ? { ...s, bidsCount: s.bidsCount + 1 } : s)));
    };

    return (
        <AppContext.Provider value={{ shipments, drivers, bids, walletTransactions, driverTransactions, notifications, chatMessages, walletBalance, driverWalletBalance, driverOnline, setDriverOnline, addShipment, updateShipmentStatus, acceptBid, getShipmentBids, getActiveShipments, getShipmentById, getDriverShipments, getBrokerShipments, sendChatMessage, getChatMessages, markNotificationRead, getUnreadNotifCount, processPayment, submitBid }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() { const context = useContext(AppContext); if (!context) throw new Error('useApp must be used within AppProvider'); return context; }
