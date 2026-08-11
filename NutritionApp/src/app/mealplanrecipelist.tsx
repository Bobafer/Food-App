import React, {useState} from 'react';
import { View,Text,Image,StyleSheet,TouchableOpacity,ImageSourcePropType, ScrollView, FlatList,} from "react-native"
import {Recipe} from './recipe';

export const RecipeList = () => {
  
    
    return(
        
        <ScrollView style={styles.recipewindow}
        showsVerticalScrollIndicator={false}>
            <Text style={styles.recipetext}>Recipes</Text>
            {<Recipe />}
            {<Recipe />}
            {<Recipe />}
            {<Recipe />}
            {<Recipe />}
            {<Recipe />}
            {<Recipe />}
            {<Recipe />}
            {<Recipe />}
            {<Recipe />}
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