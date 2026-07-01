import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './screens/HomeScreen'
import CameraScreen from './screens/CameraScreen'
import SettingsScreen from './screens/SettingsScreen'

// Screen Names
const homeName = 'Home';
const cameraName = 'Camera';
const settingsName = 'Settings';

const Tab = createBottomTabNavigator();


export default function MainContainer(){
   return(
    <NavigationContainer>
        <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({route}: {route: any}) => ({
            tabBarActiveTintColor: 'olive',
            tabBarInactiveTintColor: 'grey',
            tabBarLabelStyle: {
                paddingBottom: 10,
                fontSize: 10,
            },
            tabBarStyle: {
                padding: 10,
                height: 70,
            },
            tabBarIcon: ({focused, color, size}: {focused : any, color : any, size : any}) => {
                //let iconName: keyof typeof IonIcons.glyphMap = 'home';
                let iconName;
                let rn = route.name;

                if (rn === homeName) {
                    iconName = focused ? 'home' : 'home-outline'
                }
                else if (rn === cameraName){
                    iconName = focused ? 'list' : 'list-outline'
                }
                else if (rn === settingsName){
                    iconName = focused ? 'settings' : 'settings-outline'
                }

                return <Ionicons name={'home'} size={size} color={color}/>;

            },
        })}
        
        >

        <Tab.Screen name={homeName} component={HomeScreen}/>
        <Tab.Screen name={cameraName} component={CameraScreen}/>
        <Tab.Screen name={settingsName} component={SettingsScreen}/>



        </Tab.Navigator>

    </NavigationContainer>
   );
}