import { Text, View, StyleSheet, } from "react-native";
import {Recipe} from './recipe'
import {Portion} from './portion'
import {Instructions} from './instructions'
import { MealPlan } from "./mealplanbuttons";
import breakfast from '@/assets/images/cereals.png';
import lunch from '@/assets/images/lunch.jpg';
import dinner from '@/assets/images/dinner.png';
import snack from '@/assets/images/snack.png';


export default function Index() {
  return (
    <View style={styles.container}>
      <Recipe></Recipe> 
      <MealPlan mealimage = {breakfast} mealtxt="Breakfast" mealname="No Breakfast Currently Selected"></MealPlan>
      <MealPlan mealimage = {lunch} mealtxt="Lunch" mealname="No Lunch Currently Selected"></MealPlan>
      <MealPlan mealimage = {dinner} mealtxt="Dinner" mealname="No Dinner Currently Selected"></MealPlan>
      <MealPlan mealimage = {snack} mealtxt="Snack" mealname="No Snack Currently Selected"></MealPlan>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
