import { Text, View, StyleSheet, } from "react-native";
import {Recipe} from './recipe'
import {Portion} from './portion'
import {Instructions} from './instructions'
import { MealPlan } from "./mealplan";

export default function Index() {
  return (
    <View style={styles.container}>
      <Recipe></Recipe>
      <MealPlan></MealPlan>
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
