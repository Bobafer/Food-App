import { Text, View, StyleSheet, } from "react-native";
import {Recipe} from './recipe'
import {Portion} from './portion'
import { Button } from "expo-router/build/react-navigation";
import {NavBar} from './NavBar'
import {InventoryScreen} from './inventory'
import {HomeScreen} from './home'
import {Instructions} from './instructions'

export default function Index() {
  return (
    <View style={styles.container}>
      {/* <Recipe></Recipe> */}

      <NavBar>
        
      </NavBar>
      {/* <HomeScreen></HomeScreen>} */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
});
