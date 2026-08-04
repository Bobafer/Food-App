import React, {useState} from 'react';
import { View,Text,Image,StyleSheet,TouchableOpacity, ImageSourcePropType } from "react-native"
import { ChooseMeal } from './choosemeal';

type MealProps = {
    mealimage: ImageSourcePropType;
    mealtxt: string;
    mealname: string;
}

export const MealPlan = (props: MealProps) => {

    const [showChooseMeal, setShowChooseMeal] = useState(false);


    return(
        <TouchableOpacity
            style={styles.container}
            onPress={() => setShowChooseMeal(!showChooseMeal)}
            activeOpacity={0.8}
        >
            <View style={styles.row}>
                <Image source={props.mealimage} style={styles.image} />
                <View style={styles.textWrapper}>
                    <Text style={styles.MealText}>{props.mealtxt}</Text>
                    <Text style={styles.MealName}>{props.mealname}</Text>
                </View>
            </View>

            {showChooseMeal && <ChooseMeal/>}
            {/* {showChooseMeal ? <ChooseMeal></ChooseMeal> : null} */}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: '#ffffff',
        boxShadow: "0 4px 8px 0 rgb(0, 0, 0)",
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 350,
        padding: 12,
        marginVertical: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 12,
        marginRight: 12,
    },
    textWrapper: {
        alignItems: 'flex-start',
    },
    MealText: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    MealName: {
        fontSize: 15,
        color: '#555',
    },
})