import { View,Text,Image,StyleSheet,TouchableOpacity } from "react-native"
import breakfast from '@/assets/mages/cereal.jpg';

export const MealPlan = () => {

    return(
        <TouchableOpacity
                    style={styles.container}
                    //onPress={() => setShowPortion(!showPortion)}
                    activeOpacity={0.8}> 
                    <Image source = {} style = {styles.image}></Image>
                    <Text>Breakfast</Text>
        </TouchableOpacity>

    )
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: '#fff',
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        
        justifyContent: 'flex-start',
        alignItems: 'center',
    },})