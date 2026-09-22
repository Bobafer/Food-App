import React from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native"
import {Recipe} from './recipe';

// ADDED: onSelect — forwarded straight through to every Recipe card. When
// this list is shown inside ChooseMeal, tapping any card reports that
// recipe's data back up the chain instead of expanding its details.
//
// CHANGED: the 10 repeated <Recipe /> lines became a small array + .map() —
// same visual result, but each one now gets a proper `key` prop (React was
// previously missing this and would warn about it), and it's a lot easier
// to later swap in 10 different real recipes instead of the same one 10
// times.
export const RecipeList = ({ onSelect }) => {

    const placeholderRecipeSlots = Array.from({ length: 10 });

    return(
        <ScrollView style={styles.recipewindow}
        showsVerticalScrollIndicator={false}>
            <Text style={styles.recipetext}>Recipes</Text>

            {placeholderRecipeSlots.map((_, index) => (
                <Recipe key={index} onSelect={onSelect} />
            ))}
        </ScrollView>
    )


}

    const styles = StyleSheet.create({
        recipewindow: {
            flex: 1,
            gap: 10,
            maxHeight: 500,
            marginTop: 10,
            
        },
        recipetext: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        recipeScroll: {

        }
    })
