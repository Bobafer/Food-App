import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// A small "please wait" popup: a spinner plus a message, centered over the
// whole screen with a dimmed background. While it's visible, taps can't reach
// the screen underneath, so the user can't start a second scan by accident.
//
// Usage:
//   <LoadingOverlay visible={isAnalyzing} message="Finding recipes you can make..." />
type LoadingOverlayProps = {
    visible: boolean;
    message?: string;
};

export const LoadingOverlay = ({
    visible,
    message = 'Loading...',
}: LoadingOverlayProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            // Android's back button: do nothing, so it can't dismiss the
            // popup while the work is still running.
            onRequestClose={() => {}}
        >
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <ActivityIndicator size="large" color="#6FA377" />
                    <Text style={styles.message}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(20, 30, 20, 0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 28,
        paddingHorizontal: 32,
        alignItems: 'center',
        maxWidth: 280,
    },
    message: {
        marginTop: 16,
        fontSize: 15,
        fontWeight: '600',
        color: '#3F6647',
        textAlign: 'center',
    },
});
