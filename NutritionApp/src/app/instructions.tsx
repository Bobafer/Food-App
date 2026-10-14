
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import React from 'react';

type InstructionsProps = {
    ingredients?: string[];
    instructions?: string[];
};

export const Instructions = ({
    instructions = [],
}: InstructionsProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Instructions</Text>

            {instructions.length > 0 ? (
                instructions.map((instruction, index) => (
                    <Text
                        key={`instruction-${index}`}
                        style={styles.instruction}
                    >
                        {index + 1}. {instruction}
                    </Text>
                ))
            ) : (
                <Text style={styles.emptyText}>
                    No instructions available for this recipe.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 4,
    },

    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#3F6647',
        marginTop: 6,
        marginBottom: 5,
    },

    instruction: {
        fontSize: 14,
        lineHeight: 21,
        color: '#22331F',
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 21,
        color: '#5F6B5F',
    },
});