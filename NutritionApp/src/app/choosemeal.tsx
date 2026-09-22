import {View, Text,  StyleSheet, Button,TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { RecipeList } from './mealplanrecipelist';

// ADDED: onSelect — forwarded straight through to RecipeList (and from
// there, to every Recipe card inside it).
export const ChooseMeal = ({ onSelect }) => {

    const [ showRecipeList, setShowRecipeList] = useState(false);

    return(
    <TouchableOpacity
        style={styles.container}
        onPress={() => setShowRecipeList(!showRecipeList)}
        activeOpacity={0.8}
        >
            <View style={styles.row}>
                    <View style={styles.button}>
                        <Text style={styles.ButtonText}>Choose your meal</Text>
                    </View>
            </View>

        {showRecipeList && <RecipeList onSelect={onSelect}/>}
    </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#90EE90',
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
        marginHorizontal: 80,
        
    },
    ButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    }
})
