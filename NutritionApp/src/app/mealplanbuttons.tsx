import React, {useState} from 'react';
import { View,Text,Image,StyleSheet,TouchableOpacity, ImageSourcePropType } from "react-native"
import { ChooseMeal } from './choosemeal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MealProps = {
    mealimage: "weather-sunny" | "weather-night" | 'weather-partly-cloudy' | 'weather-partly-cloudy';
    mealtxt: string;
    mealname: string;
    // ADDED: the recipe currently assigned to this slot (or null/undefined
    // if nothing's been picked yet), and a callback to save a new pick.
    // Both are owned by MealPlanScreen (in NavBar.js), keyed by date+slot,
    // which is what makes switching days and coming back show the right
    // thing — this component itself holds none of that data permanently.
    selectedRecipe?: { name: string; description: string; image: any } | null;
    onSelectRecipe: (recipe: { name: string; description: string; image: any }) => void;
}

export const MealPlan = (props: MealProps) => {

    const [showChooseMeal, setShowChooseMeal] = useState(false);

    // CHANGED: when a recipe gets picked from ChooseMeal/RecipeList, this
    // both reports it up to MealPlanScreen (so it actually gets saved) AND
    // collapses this card back to its compact view — otherwise ChooseMeal
    // and RecipeList would stay expanded underneath after picking something.
    const handleRecipeSelected = (recipe: { name: string; description: string; image: any }) => {
        props.onSelectRecipe(recipe);
        setShowChooseMeal(false);
    };

    const hasSelectedRecipe = !!props.selectedRecipe;

    return(
        <View>


        <TouchableOpacity
            style={styles.container}
            onPress={() => setShowChooseMeal(!showChooseMeal)}
            activeOpacity={0.8}
        >

            <View style={styles.row}>
                {hasSelectedRecipe ? (
                    // CHANGED: once a recipe is assigned, show its actual
                    // image instead of the generic weather-style icon.
                    <Image source={props.selectedRecipe!.image} style={styles.image} />
                ) : (
                    <MaterialCommunityIcons name={props.mealimage} size={50} color="#5C8A66" style={{ marginRight: 12 }} />
                )}
                <View style={styles.textWrapper}>
                    <Text style={styles.MealText}>{props.mealtxt}</Text>
                    {/* CHANGED: shows the selected recipe's name once one is
                        picked, falling back to the original placeholder
                        text (mealname) otherwise. */}
                    <Text style={styles.MealName}>
                        {hasSelectedRecipe ? props.selectedRecipe!.name : props.mealname}
                    </Text>
                </View>
            </View>

            {showChooseMeal && <ChooseMeal onSelect={handleRecipeSelected} />}
        </TouchableOpacity>


        


        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: '#ffffff',
        boxShadow: "0 4px 8px 0 rgb(0, 0, 0)",
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 350,
        padding: 12,
        marginVertical: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 12,
        marginRight: 12,
    },
    textWrapper: {
        alignItems: 'flex-start',
    },
    MealText: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    MealName: {
        fontSize: 15,
        color: '#555',
    },
})
