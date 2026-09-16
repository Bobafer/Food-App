import { View, StyleSheet } from 'react-native';
import { NavBar } from './NavBar';

export default function Index() {
  return (
    <View style={styles.outer}>

      <View style={styles.phoneFrame}>
        <NavBar></NavBar>
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
