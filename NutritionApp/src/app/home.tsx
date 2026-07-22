import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import {Ionicons,} from '@expo/vector-icons';

const THUMBNAILS = [
'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200',
  'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200',
  'https://www.kitchenaid.com/is/image/content/dam/business-unit/kitchenaid/en-us/marketing-content/site-assets/page-content/blog/13-pro-tips-for-refrigerator-organization-that-lasts/Flyout-Image-1-fridge-organization-230351KRP01-027_KRSC536RPS_Set_sRGB-KRSC536RPS.jpg?fmt=webp-alpha&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&scl=1&constrain=fit,1',
];

export function HomeScreen({navigation}){
    return(
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle='dark-content' />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>PickToPlate</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Snap Your Fridge</Text>

              <TouchableOpacity
              style={styles.cameraButton}
              activeOpacity={0.85}
              // This is where button navigation goes
              //  onPress={() => }
              >
              <View style={styles.cameraIconCircle}>
                  <Ionicons name="camera-outline" size = {40} color = "#5C8A66" />
              </View>
              <Text style={styles.cameraButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <View style = {styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
              </View>

              <View style = {styles.thumbRow}>
                {THUMBNAILS.map((uri,i) => (
                  <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => {}}>
                    <Image source={{uri}} style = {styles.thumb}/> 
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.caption}>Analyze your ingridents in seconds</Text>
          </View>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    safeArea: {
        flex:1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor:'#EAF3EA',
        paddingVertical: 16,
        alignItems: 'center',
    },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3F6647',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#22331F',
    marginBottom: 24,
  },
  cameraButton: {
    width: '100%',
    aspectRatio: 1.6,
    backgroundColor: '#6FA377',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDE3DD',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9AA39C',
    fontSize: 13,
    fontWeight: '600',
  },
  thumbRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  thumb: {
    width: 96,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
  },
  caption: {
    marginTop: 75,
    fontSize: 20,
    fontWeight: '600',
    color: '#3F6647',
    textAlign: 'center',
    backgroundColor: '#EAF3EA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
});









