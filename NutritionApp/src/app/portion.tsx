import {View, Text,  StyleSheet, Button} from 'react-native';
import React from 'react';
export const Portion = () => {
    return(
        <View style={styles.container}>
            <View style={styles.textWrapper}>
                <Text style={styles.portionTitle}>Portion Sizes</Text>
                <View style={styles.line}></View>
                <View style={styles.totalContainer}>
                    <Text style={styles.portionCalories}>Calories:</Text>
                    <Text style ={styles.totalValue}>400 calories</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.portionProtien}>Protien:</Text>
                    <Text style={styles.totalValue}> 10 grams</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.portionCarbs}>Carbs:</Text>
                    <Text style={styles.totalValue}>20 grams</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.portionFats}>Fat:</Text>
                    <Text style={styles.totalValue}>50 grams</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.portionEggs}>Eggs:</Text>
                    <Text style={styles.totalValue}>1</Text>
                </View>
            </View>
            <View>
                <Button 
                color = '#90EE90'
                title='Details'
                />
               
            </View>
        
        
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        borderRadius: "15px",
        //boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5,
        paddingBottom:10
    },
     textWrapper: {
        width: 250, 
        alignItems: 'flex-start'
    },
    portionTitle: {
        fontSize:14,
        paddingLeft:16,
        padding:3,
        fontWeight: 'bold'
    },
    portionCalories: {
        fontSize:14,
        paddingLeft:16,
        padding:4,
        fontWeight: 'bold'
    },
    portionProtien:{
        fontSize:13,
        paddingLeft:16,
        padding:4,
        fontWeight: 'bold'
    },
    portionCarbs:{
        fontSize:14,
        paddingLeft:16,
        padding:4,
        fontWeight: 'bold'
    },
    portionFats:{
        fontSize:14,
        padding:4,
        paddingLeft:16,
        fontWeight: 'bold'
    },
    portionEggs:{
        fontSize:14,
        paddingLeft:16,
        padding:4,
        fontWeight: 'bold'
    },
    totalValue: {
        padding: 4,
        paddingLeft:16,
        fontSize: 14,
        marginLeft: -12,
        marginBottom: 4,
    },
     totalContainer: {
        flexDirection:'row',
        alignItems:'baseline',
        justifyContent: 'center'
        
    },
    line: {
        padding:0,
        height:1,
        width: '100%',
        backgroundColor: '#000000',
        marginVertical: 10,
    }

})