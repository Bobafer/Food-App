import { Text, View, StyleSheet, } from "react-native"


import {NavBar} from './NavBar'
import {HomeScreen} from './home'

export default function Index() {
  return (
    <View style={styles.container}>
      <NavBar>
        
      </NavBar>

      {/* {<HomeScreen></HomeScreen>} */}

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
