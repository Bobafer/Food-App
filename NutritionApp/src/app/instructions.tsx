import {SafeAreaView ,ScrollView,View, Text,  StyleSheet, Button} from 'react-native';
import React from 'react';

export const Instructions = () => {
    return(
        <ScrollView 
        showsVerticalScrollIndicator={false}
         style = {styles.scrollContainer}>
            <View style = {styles.container}>
                <View style = {styles.textWrapper}>
                    <Text style = {styles.titleStep}>Ingredients</Text>
                    <Text> {'\u2022'} Dough: 4 cups bread flour (or all-purpose),</Text> 
                    <Text> {'\u2022'}  1.5 cups warm water, </Text>
                    <Text> {'\u2022'} 2 tsp instant yeast, </Text>
                    <Text> {'\u2022'}  2 tsp salt, </Text>
                    <Text> {'\u2022'} 1 Tbsp olive oil.</Text>
                    <Text> {'\u2022'} Toppings: 1/2 cup pizza sauce,</Text> 
                    <Text> {'\u2022'} 1.5 cups shredded low-moisture mozzarella.</Text>
                    <Text style = {styles.stepTitle}>Step 1: Make the DoughMix: </Text>
                    <Text> {'\u2022'} Combine the warm water and yeast in a large bowl. </Text>
                    <Text> {'\u2022'} Let it sit for 5 minutes until foamy. </Text>
                    <Text> {'\u2022'}  Stir in the flour, salt, and olive oil until a shaggy dough forms.</Text>
                    <Text> {'\u2022'} Knead: Turn the dough out onto a lightly floured surface and knead for 8–10 minutes until smooth and elastic.</Text>
                    <Text> {'\u2022'} Rise: Place the dough in an oiled bowl, </Text>
                    <Text> {'\u2022'} Cover it with a damp towel or plastic wrap, and let it rise at room temperature for 1.5 to 2 hours (or refrigerate overnight for better flavor) until it doubles in size.</Text>

                    <Text style = {styles.stepTitle}>Step 2: Shape the BasePrep the Oven: </Text>
                    <Text> {'\u2022'}  Place a pizza stone or heavy baking sheet on the lower rack of your oven and preheat to 475°F or 550°F.</Text>
                    <Text> {'\u2022'}  Portion & Stretch: Punch the dough down and divide it into two equal balls. </Text>
                    <Text> {'\u2022'}  On a floured surface, use your fingertips to press the dough outward from the center, leaving a thicker rim for the crust. </Text>
                    <Text> {'\u2022'}  Gently stretch the dough until it's about 12 inches across.</Text>
                    <Text> {'\u2022'}  Prep the Peel: Transfer your stretched dough onto a wooden cutting board, pizza peel, or parchment paper lightly dusted with semolina flour or cornmeal so it doesn't stick.</Text>

                    <Text style = {styles.stepTitle}>Step 3: Top the PizzaSauce:</Text>
                    <Text> {'\u2022'} Spread a thin layer of pizza sauce evenly over the dough, making sure to leave a 1-inch border for the crust.</Text>
                    <Text> {'\u2022'} Cheese & Toppings: Sprinkle a generous layer of mozzarella over the sauce, followed by your favorite toppings.</Text>
                    <Text> {'\u2022'} Be careful not to overload it, or the crust will become soggy.</Text>

                    <Text style = {styles.stepTitle}>Step 4: Bake to PerfectionSlide & Bake:</Text>    
                    <Text> {'\u2022'} Carefully slide the pizza (using the parchment paper or dusting your peel with more cornmeal) onto the hot pizza stone or inverted baking sheet in the oven.</Text>
                    <Text> {'\u2022'} Cook: Bake for 10 to 15 minutes, or until the cheese is bubbling and the crust is golden brown.</Text>
                    <Text> {'\u2022'} Remove, let cool for a minute, slice, and serve</Text>            

                </View>
            </View>            
        </ScrollView>

    );
}




const styles = StyleSheet.create({
    scrollContainer: {
        height: 200,
        width: 250, 
        borderRadius: "15px",
        borderTopLeftRadius: "15px",
        backgroundColor: '#fff',
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        marginTop: 5,
        paddingBottom:10
    },
    container: {
        borderRadius: "15px",
        backgroundColor: '#fff',
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5,
        paddingBottom:10
    },
    textWrapper: {
        width: '100%', 
        alignItems: 'flex-start',
    },
    titleStep: {
        fontSize:16,
        paddingLeft:10,
        paddingTop:5,
        fontWeight:'bold'
    },
    ingredients: {
        fontSize:14,
        paddingLeft:12,
        padding:3,
    },
    stepTitle: {
        fontSize:15,
        paddingLeft: 5,
        fontWeight: 'bold'
    }

})
