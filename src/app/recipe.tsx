import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type SavedRecipe = {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
};

const SAVED_RECIPES_STORAGE_KEY = '@PickToPlate:savedRecipes';

type RecipeScreenProps = {
    autoOpenInstructions?: boolean;
    route?: {
        params?: {
            autoOpenInstructions?: boolean;
        };
    };
};

export const RecipeScreen = ({
    autoOpenInstructions = false,
    route,
}: RecipeScreenProps) => {
    const shouldAutoOpen =
        route?.params?.autoOpenInstructions ?? autoOpenInstructions;

    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [expandedRecipes, setExpandedRecipes] = useState<
        Record<string, boolean>
    >({});
    const [showInstructions, setShowInstructions] = useState<
        Record<string, boolean>
    >({});

    const loadSavedRecipes = useCallback(async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem(
                SAVED_RECIPES_STORAGE_KEY
            );

            const parsedRecipes: SavedRecipe[] = storedRecipes
                ? JSON.parse(storedRecipes)
                : [];

            setSavedRecipes(parsedRecipes);

            if (shouldAutoOpen && parsedRecipes.length > 0) {
                const firstKey = `${parsedRecipes[0].name}-0`;

                setExpandedRecipes((current) => ({
                    ...current,
                    [firstKey]: true,
                }));

                setShowInstructions((current) => ({
                    ...current,
                    [firstKey]: true,
                }));
            }
        } catch (error) {
            console.error('Failed to load saved recipes:', error);
        }
    }, [shouldAutoOpen]);

    useFocusEffect(
        useCallback(() => {
            loadSavedRecipes();
        }, [loadSavedRecipes])
    );

    const toggleRecipe = (key: string) => {
        setExpandedRecipes((current) => ({
            ...current,
            [key]: !current[key],
        }));
    };

    const toggleInstructions = (key: string) => {
        setShowInstructions((current) => ({
            ...current,
            [key]: !current[key],
        }));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.recipesContainer}>
                    <Text style={styles.recipesTitle}>
                        Saved Recipes
                    </Text>

                    {savedRecipes.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="bookmark-outline"
                                size={36}
                                color="#5C8A66"
                            />

                            <Text style={styles.emptyTitle}>
                                No Saved Recipes Yet
                            </Text>

                            <Text style={styles.emptyText}>
                                Scan your fridge, generate recipes, and
                                tap Save Recipe to keep them here.
                            </Text>
                        </View>
                    ) : (
                        savedRecipes.map((recipe, index) => {
                            const key = `${recipe.name}-${index}`;
                            const isExpanded = expandedRecipes[key] ?? false;
                            const instructionsOpen =
                                showInstructions[key] ?? false;

                            return (
                                <View
                                    key={key}
                                    style={styles.recipeCard}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        onPress={() => toggleRecipe(key)}
                                    >
                                        <View style={styles.recipeCardText}>
                                            <Text style={styles.recipeName}>
                                                {recipe.name}
                                            </Text>

                                            <Text style={styles.recipeDescription}>
                                                {recipe.description}
                                            </Text>

                                            <Text style={styles.recipeTapHint}>
                                                {isExpanded
                                                    ? 'Tap to close ↑'
                                                    : 'Tap for recipe →'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    {isExpanded && (
                                        <View style={styles.recipeDetails}>
                                            <Text style={styles.recipeSectionTitle}>
                                                Ingredients
                                            </Text>

                                            {(recipe.ingredients ?? []).map(
                                                (ingredient, ingredientIndex) => (
                                                    <Text
                                                        key={`${ingredient}-${ingredientIndex}`}
                                                        style={styles.recipeIngredient}
                                                    >
                                                        {'• '}{ingredient}
                                                    </Text>
                                                )
                                            )}

                                            <TouchableOpacity
                                                style={styles.detailsButton}
                                                activeOpacity={0.85}
                                                onPress={() =>
                                                    toggleInstructions(key)
                                                }
                                            >
                                                <Text style={styles.detailsButtonText}>
                                                    {instructionsOpen
                                                        ? 'Hide Instructions'
                                                        : 'View Instructions'}
                                                </Text>
                                            </TouchableOpacity>

                                            {instructionsOpen && (
                                                <View>
                                                    <Text style={styles.recipeSectionTitle}>
                                                        Instructions
                                                    </Text>

                                                    {(recipe.instructions ?? []).map(
                                                        (instruction, instructionIndex) => (
                                                            <Text
                                                                key={`${key}-instruction-${instructionIndex}`}
                                                                style={styles.recipeInstruction}
                                                            >
                                                                {instructionIndex + 1}. {instruction}
                                                            </Text>
                                                        )
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    content: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
        paddingHorizontal: 24,
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 40,
    },

    recipesContainer: {
        width: '100%',
        marginTop: 20,
    },

    recipesTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#3F6647',
        marginBottom: 12,
    },

    recipeCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#D5E3D5',
    },

    recipeCardText: {
        padding: 16,
    },

    recipeName: {
        fontSize: 19,
        fontWeight: '700',
        color: '#22331F',
        marginBottom: 6,
    },

    recipeDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: '#5F6B5F',
    },

    recipeTapHint: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: '600',
        color: '#5C8A66',
    },

    recipeDetails: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },

    recipeSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#3F6647',
        marginTop: 6,
        marginBottom: 5,
    },

    recipeIngredient: {
        fontSize: 14,
        lineHeight: 21,
        color: '#22331F',
        marginLeft: 4,
    },

    recipeInstruction: {
        fontSize: 14,
        lineHeight: 21,
        color: '#22331F',
        marginBottom: 8,
    },

    detailsButton: {
        backgroundColor: '#EAF3EA',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignSelf: 'flex-start',
        marginTop: 12,
    },

    detailsButtonText: {
        color: '#3F6647',
        fontSize: 14,
        fontWeight: '700',
    },

    emptyContainer: {
        width: '100%',
        backgroundColor: '#EAF3EA',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginTop: 8,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#3F6647',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 21,
        color: '#5F6B5F',
        textAlign: 'center',
    },
});