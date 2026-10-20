
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Instructions } from './instructions';

type Recipe = {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
};

type PortionProps = {
    autoOpenInstructions?: boolean;
    recipe?: Recipe;
};

export const Portion = ({
    autoOpenInstructions = false,
    recipe,
}: PortionProps) => {
    const [showInstructions, setShowInstructions] =
        useState(autoOpenInstructions);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ingredients</Text>

            {(recipe?.ingredients ?? []).map(
                (ingredient, index) => (
                    <Text
                        key={`${ingredient}-${index}`}
                        style={styles.ingredient}
                    >
                        {'• '}{ingredient}
                    </Text>
                )
            )}

            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.85}
                onPress={() =>
                    setShowInstructions((current) => !current)
                }
            >
                <Text style={styles.buttonText}>
                    {showInstructions
                        ? 'Hide Instructions'
                        : 'View Instructions'}
                </Text>
            </TouchableOpacity>

            {showInstructions && (
                <Instructions
                    instructions={recipe?.instructions ?? []}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },

    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#3F6647',
        marginTop: 6,
        marginBottom: 5,
    },

    ingredient: {
        fontSize: 14,
        lineHeight: 21,
        color: '#22331F',
        marginLeft: 4,
    },

    button: {
        backgroundColor: '#EAF3EA',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignSelf: 'flex-start',
        marginTop: 12,
    },

    buttonText: {
        color: '#3F6647',
        fontSize: 14,
        fontWeight: '700',
    },
});