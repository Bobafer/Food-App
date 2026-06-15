import {View, Text, Image} from 'react-native'
import pizza from '@/assets/Recipe_Images/pizza.jpg'

export const Recipe = () => {
    return(
        <View> 
            <Image
            source ={pizza}>
            </Image>
            <Text>Recipes</Text>
        </View>
    )

}