import { View,Text,Image,StyleSheet,TouchableOpacity, ImageSourcePropType } from "react-native"

type MealProps = {
    mealimage: ImageSourcePropType;
    mealtxt: string;
    mealname: string;
}

export const MealPlan = (props: MealProps) => {
    return(
        <TouchableOpacity
                    style={styles.container}
                    //onPress={() => setShowPortion(!showPortion)}
                    activeOpacity={0.8}> 
                    <View>
                        <Image source = {props.mealimage} style = {styles.image}></Image>
                        <Text style={styles.MealText}>{props.mealtxt}</Text>
                    </View>
                    
                    <Text style={styles.MealName}>{props.mealname}</Text>

                    
        </TouchableOpacity>

    )

}


const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: '#ffffff',
        boxShadow: "0 4px 8px 0 rgb(0, 0, 0)",
        
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width:350,
        //height:90,

    },
    image:{
        borderTopRightRadius: '15px',
        borderTopLeftRadius: '15px',
        padding:30,
        width:50,
        height:50,
        marginTop:5,
        marginLeft:7,
    },
    MealText:{
        padding:1,
        fontSize:17,
        marginLeft:7,
    },
    MealName:{
        padding:1,
        fontSize:17,
        marginLeft:100,
    },
})