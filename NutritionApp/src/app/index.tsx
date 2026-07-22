import { Text, View, StyleSheet, } from "react-native";
import {Recipe} from './recipe'
import {Portion} from './portion'
import {Instructions} from './instructions'
import { MealPlan } from "./mealplan";
import breakfast from '@/assets/images/cereals.png';
import lunch from '@/assets/images/lunch.jpg';
import dinner from '@/assets/images/dinner.png';


export default function Index() {
  return (
    <View style={styles.container}>
      <Recipe></Recipe>
      <MealPlan mealimage = {breakfast} mealtxt="Breakfast" mealname="breakfast_name"></MealPlan>
      <MealPlan mealimage = {lunch} mealtxt="Lunch" mealname="lunch_name"></MealPlan>
      <MealPlan mealimage = {dinner} mealtxt="Dinner" mealname="dinner_name"></MealPlan>
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
