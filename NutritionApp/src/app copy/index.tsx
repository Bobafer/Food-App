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
    // "outer" fills the whole browser window and is what shows on either
    // side once the phone frame is narrower than your window.
    <View style={styles.outer}>
      {/* "phoneFrame" caps the width so the app looks like a phone screen
          even on a wide laptop browser. NavBar renders inside it, so this
          constrains the header, content, AND the bottom tab bar together. */}
      <View style={styles.phoneFrame}>
        {/* <Recipe></Recipe> */}
        <NavBar></NavBar> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#FFFFFF',
  },
});
