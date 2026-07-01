import * as React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen({ navigation }: {navigation: any}) {
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('You are already on the Home Screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen
            </Text>
        </View>
    )
}