import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
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

export const RecipeList = ({ onSelect }) => {
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const loadSavedRecipes = useCallback(async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem(SAVED_RECIPES_STORAGE_KEY);
            setSavedRecipes(storedRecipes ? JSON.parse(storedRecipes) : []);
        } catch (error) {
            console.warn('Failed to load saved recipes for meal picker:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadSavedRecipes();
        }, [loadSavedRecipes])
    );

    return(
        <ScrollView style={styles.recipewindow} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            <Text style={styles.recipetext}>Recipes</Text>
            {isLoaded && savedRecipes.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Ionicons name="bookmark-outline" size={28} color="#5C8A66" />
                    <Text style={styles.emptyText}>
                        No saved recipes yet. Scan your fridge and save a recipe from Home first.
                    </Text>
                </View>
            )}
            {savedRecipes.map((recipe, index) => (
                <TouchableOpacity
                    key={`${recipe.name}-${index}`}
                    style={styles.recipeRow}
                    activeOpacity={0.8}
                    onPress={() => onSelect(recipe)}
                >
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                    <Text style={styles.recipeDescription}>{recipe.description}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    recipewindow: { flex: 1, gap: 10, maxHeight: 500, marginTop: 10 },
    recipetext: { fontSize: 20, fontWeight: 'bold' },
    emptyContainer: { alignItems: 'center', paddingVertical: 20, gap: 8 },
    emptyText: { fontSize: 13, color: '#5F6B5F', textAlign: 'center', paddingHorizontal: 20 },
    recipeRow: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D5E3D5',
        padding: 12,
        marginBottom: 8,
    },
    recipeName: { fontSize: 15, fontWeight: '700', color: '#22331F' },
    recipeDescription: { fontSize: 13, color: '#5F6B5F', marginTop: 2 },
})