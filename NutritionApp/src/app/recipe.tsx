import {View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import pizza from '@/assets/Recipe_Images/pizza.jpg';
import React, {useState} from 'react';
import {Portion} from './portion';
import {Instructions} from './instructions'

// ADDED: pulled the hardcoded values out into their own object — this is
// the actual data that gets handed back via onSelect when this card is
// tapped in "choose a meal" mode. Once there's more than one real recipe,
// this becomes a prop instead of a hardcoded constant.
const PIZZA_RECIPE = {
    name: 'Pizza',
    description: 'Italian bread with sauce',
    image: pizza,
};

// ADDED: autoOpenInstructions — when true, the Portion section (and
// Instructions inside it) start already expanded, instead of requiring a tap.
// Only passed as true from Home's "Recommended Recipe" card; the normal
// Recipes tab renders <Recipe /> with no prop, so it stays closed by default.
//
// ADDED: onSelect — when provided, this card is in "choose a meal" mode:
// tapping it calls onSelect(PIZZA_RECIPE) to report which recipe was picked,
// instead of expanding Portion/Instructions. Used by RecipeList when it's
// shown inside ChooseMeal.
export const Recipe = ({ autoOpenInstructions = false, onSelect }) => {

    const [showPortion, setShowPortion] = useState(autoOpenInstructions);

    const handlePress = () => {
        if (onSelect) {
            onSelect(PIZZA_RECIPE);
            return;
        }
        setShowPortion(!showPortion);
    };

    return(
        <SafeAreaView style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                style={styles.container}
                onPress={handlePress}
                activeOpacity={0.8}>
                    <Image source ={PIZZA_RECIPE.image} style ={styles.image}></Image>

                <View style={styles.textWrapper}>
                    <Text style={styles.recpieTitle}>{PIZZA_RECIPE.name}</Text>
                    <Text style={styles.recipeDescription}>{PIZZA_RECIPE.description}</Text>
                    <View style={styles.totalContainer}>
                        <Text style={styles.calorieTitle}>Total Calories:</Text>
                        <Text style={styles.totalValue}>1200g?</Text>
                    </View>
                </View>

                {!onSelect && showPortion && <Portion autoOpenInstructions={autoOpenInstructions} />}
            </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingBottom: 40,
    },
    container: {
        borderRadius: 15,
        backgroundColor: '#fff',
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image:{
        borderTopRightRadius: '24px',
        borderTopLeftRadius: '24px',
        width:250,
        height:200,
    },
    recpieTitle:{
        paddingLeft: 16,
        padding: 4,
        fontSize:20,
        fontWeight: 'bold',
    },
    recipeDescription:{
        fontSize: 14,
        paddingLeft:16,
        padding: 4,
    },
    calorieTitle:{
        padding:4,
        paddingLeft:16,
        fontSize:14,
        fontWeight: 'bold',
        alignSelf:'flex-start'
    },
    totalContainer: {
        flexDirection:'row',
        alignItems:'baseline',
        justifyContent: 'center'
        
    },
    totalValue: {
        padding: 4,
        paddingLeft:16,
        fontSize: 14,
        marginLeft: -12,
        marginBottom: 4,
    },
    textWrapper: {
        width: 250, 
        alignItems: 'flex-start'
    }
});
