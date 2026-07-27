import { Text, View, StyleSheet, } from "react-native";
import {Recipe} from './recipe'
import {Portion} from './portion'
import {InventoryScreen} from './inventory'

export default function Index() {
  return (
    <View style={styles.container}>
      {/* <Recipe></Recipe> */}
      <InventoryScreen></InventoryScreen>
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
