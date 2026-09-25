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
    <View style={styles.outer}>

      <View style={styles.phoneFrame}>
        {/* <Recipe></Recipe>
        <NavBar></NavBar> */}
        <InventoryScreen></InventoryScreen>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430, // roughly iPhone-width cap
    backgroundColor: '#fff',
  },
});
