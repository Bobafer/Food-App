import {View, Text, Image, StyleSheet,TouchableOpacity} from 'react-native';
import pizza from '@/assets/Recipe_Images/pizza.jpg';
import React, {useState} from 'react';
import {Portion} from './portion';



export const Recipe = () => {

    const [showPortion, setShowPortion] = useState(false);

    return(
            <TouchableOpacity 
            style={styles.container}
            onPress={() => setShowPortion(!showPortion)} 
            activeOpacity={0.8}> 
                <Image source ={pizza} style ={styles.image}></Image>
            
            <View style={styles.textWrapper}>
                <Text style={styles.recpieTitle}>Pizza</Text>
                <Text style={styles.recipeDescription}>Italian bread with sauce</Text>
                <View style={styles.totalContainer}>
                    <Text style={styles.calorieTitle}>Total Calories:</Text>
                    <Text style={styles.totalValue}>1200g?</Text>
                </View>
            </View>

            {showPortion && <Portion />}
        </TouchableOpacity>
    );

};

const styles = StyleSheet.create({
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


