import {View, Text,  StyleSheet} from 'react-native';
import React from 'react';
export const Portion = () => {
    return(
        <View style={styles.container}>
            <View style={styles.textWrapper}>
                <Text style={styles.portionTitle}>Portion Sizes</Text>
                <View style={styles.line}></View>
                <Text style={styles.portionCalories}>Calories:</Text>
                <Text style={styles.portionProtien}>Protien:</Text>
                <Text style={styles.portionCarbs}>Carbs:</Text>
                <Text style={styles.portionFats}>Fat:</Text>
                <Text style={styles.portionEggs}>Eggs:</Text>
            </View>
        
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        borderRadius: "15px",
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 15,
    },
     textWrapper: {
        width: 250, 
        alignItems: 'flex-start'
    },
    portionTitle: {
        fontSize:20,
        paddingLeft:16,
        padding:3,
        fontWeight: 'bold'
    },
    portionCalories: {
        fontSize:20,
        paddingLeft:16,
        padding:4,
        fontWeight: 'bold'
    },
    portionProtien:{
        fontSize:20,
        paddingLeft:16,
        padding:4,
        fontWeight: 'bold'
    },
    portionCarbs:{
        fontSize:20,
        paddingLeft:16,
        padding:4,
        fontWeight: 'bold'
    },
    portionFats:{
        fontSize:20,
        padding:4,
        paddingLeft:16,
        fontWeight: 'bold'
    },
    portionEggs:{
        fontSize:20,
        paddingLeft:16,
        padding:4,
        fontWeight: 'bold'
    },
    line: {
        padding:0,
        height:1,
        width: '100%',
        backgroundColor: '#000000',
        marginVertical: 10,
    }

})