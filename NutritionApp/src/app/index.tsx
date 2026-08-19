import {NavBar} from './NavBar'


export default function Index() {
  return (
    // "outer" fills the whole browser window and is what shows on either
    // side once the phone frame is narrower than your window.
    <View style={styles.outer}>
      {/* "phoneFrame" caps the width so the app looks like a phone screen
          even on a wide laptop browser. NavBar renders inside it, so this
          constrains the header, content, AND the bottom tab bar together. */}
      <View style={styles.phoneFrame}>
        {/* <Recipe></Recipe>
        <NavBar></NavBar> */}
        <InventoryScreen></InventoryScreen>
      </View>
    </View>
  );

}
