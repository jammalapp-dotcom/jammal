// @ts-nocheck
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Platform, Alert, Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface AlertButton { text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive'; }
export interface AlertState { visible: boolean; title: string; message: string; buttons: AlertButton[]; }

interface AlertContextType { showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void; }
const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alertState, setAlertState] = useState<AlertState>({ visible: false, title: '', message: '', buttons: [] });

    const showAlert = (title: string, message?: string, buttons?: AlertButton[]) => {
        const normalizedMessage = message || '';
        const normalizedButtons = buttons?.length ? buttons : [{ text: 'OK', onPress: () => { } }];
        if (Platform.OS === 'web') {
            setAlertState({ visible: true, title, message: normalizedMessage, buttons: normalizedButtons });
        } else {
            Alert.alert(title, normalizedMessage, normalizedButtons.map(b => ({ text: b.text, onPress: b.onPress, style: b.style })));
        }
    };

    const hideAlert = () => setAlertState(prev => ({ ...prev, visible: false }));
    const handleButtonPress = (button: AlertButton) => {
        try { if (typeof button.onPress === 'function') button.onPress(); hideAlert(); } catch { hideAlert(); }
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {Platform.OS === 'web' && alertState.visible && (
                <Modal visible={alertState.visible} transparent animationType="fade">
                    <View style={styles.overlay}>
                        <View style={styles.container}>
                            <View style={styles.content}>
                                <Text style={styles.title}>{alertState.title}</Text>
                                {alertState.message ? <Text style={styles.message}>{alertState.message}</Text> : null}
                            </View>
                            <View style={styles.buttonContainer}>
                                {alertState.buttons.length === 1 ? (
                                    <TouchableOpacity style={[styles.button, styles.singleButton]} onPress={() => handleButtonPress(alertState.buttons[0])} activeOpacity={0.8}>
                                        <Text style={styles.defaultButtonText}>{alertState.buttons[0].text}</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.multiButtonContainer}>
                                        {alertState.buttons.map((button, index) => (
                                            <TouchableOpacity key={index} style={[styles.button, index < alertState.buttons.length - 1 && styles.buttonWithBorder]} onPress={() => handleButtonPress(button)} activeOpacity={0.8}>
                                                <Text style={button.style === 'destructive' ? styles.destructiveButtonText : button.style === 'cancel' ? styles.cancelButtonText : styles.defaultButtonText}>{button.text}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </AlertContext.Provider>
    );
}

export function useAlert(): AlertContextType {
    const context = useContext(AlertContext);
    if (context === undefined) throw new Error('useAlert must be used within an AlertProvider');
    return context;
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    container: { backgroundColor: '#FFFFFF', borderRadius: 14, minWidth: 280, maxWidth: 420 },
    content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
    title: { fontSize: 17, fontWeight: '600', color: '#1D1D1F', marginBottom: 8, textAlign: 'center' },
    message: { fontSize: 15, color: '#86868B', textAlign: 'center', lineHeight: 20 },
    buttonContainer: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#D1D1D6' },
    multiButtonContainer: { flexDirection: 'row' },
    button: { paddingVertical: 17, alignItems: 'center', justifyContent: 'center', minHeight: 56, flex: 1, backgroundColor: 'transparent' },
    singleButton: { flex: 0, width: '100%' },
    buttonWithBorder: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: '#D1D1D6' },
    defaultButtonText: { color: '#007AFF', fontSize: 17, fontWeight: '600' },
    cancelButtonText: { color: '#007AFF', fontSize: 17, fontWeight: '400' },
    destructiveButtonText: { color: '#FF3B30', fontSize: 17, fontWeight: '600' },
});
