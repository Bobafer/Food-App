import { View,Text,Image,StyleSheet,TouchableOpacity, ImageSourcePropType } from "react-native"

type MealProps = {
    mealimage: ImageSourcePropType;
    mealtxt: string;
}

export const MealPlan = (props: MealProps) => {
    return(
        <TouchableOpacity
                    style={styles.container}
                    //onPress={() => setShowPortion(!showPortion)}
                    activeOpacity={0.8}> 
                    
                    <Image source = {props.mealimage} style = {styles.image}></Image>
                    <Text style={styles.breakfastText}>{props.mealtxt}</Text>

                    
        </TouchableOpacity>

    )

}


const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: '#fff',
        boxShadow: "0 4px 8px 0 rgb(0, 0, 0)",
        
        justifyContent: 'flex-start',
        alignItems: 'center',
        width:100,
        height:100,

    },
    image:{
        borderTopRightRadius: '15px',
        borderTopLeftRadius: '15px',
        padding:35,
        width:50,
        height:50,
        marginTop:5,
    },
    breakfastText:{
        padding:1,
        fontSize:17,
    },
})