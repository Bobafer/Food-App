import {View, Text, Image, StyleSheet} from 'react-native'
import pizza from '@/assets/Recipe_Images/pizza.jpg'


export const Recipe = () => {
    return(
        <View style={styles.container}> 
            <Image source ={pizza} style ={styles.image}></Image>
            
            <View style={styles.textWrapper}>
                <Text style={styles.recpieTitle}>Pizza</Text>
                <View style={styles.totalContainer}>
                    <Text style={styles.calorieTitle}>Total Calories:</Text>
                    <Text style={styles.totalValue}>200</Text>
                </View>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image:{
        width:250,
        height:200,
    },
    recpieTitle:{
        fontSize:24,
        fontWeight: 'bold',
    },
    calorieTitle:{
        fontSize:24,
        fontWeight: 'bold',
        alignSelf:'flex-start'
    },
    totalContainer: {
        flexDirection:'row',
        alignItems:'baseline'
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    textWrapper: {
        width: 250, 
        alignItems: 'flex-start'
    }
});


