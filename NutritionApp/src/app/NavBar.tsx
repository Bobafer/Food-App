import * as React from 'react';
import { Text, View, Image } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';
import { HomeScreen } from './home';
import { RecipeScreen } from './recipe';
import { InventoryScreen } from './inventory';
import SettingsScreen from './Settings';

// function SettingsScreen() {
//   React.useEffect(() => {
//     console.log('SettingsScreen mounted');

//     return () => console.log('SettingsScreen unmounted');
//   }, []);

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Settings Screen</Text>
//     </View>
//   );
// }

function MealPlanScreen () {
  React.useEffect(() => {
    console.log('MealPlanScreen mounted');

    return () => console.log('MealPlanScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Meal Plan Screen</Text>
    </View>
  );
}


function DetailsScreen() {
  const navigation = useNavigation<any>();

  React.useEffect(() => {
    console.log('DetailsScreen mounted');

    return () => console.log('DetailsScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button onPress={() => navigation.push('Details')}>
        Go to Details... again
      </Button>
    </View>
  );
}

const HomeStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const RecipesStack = createNativeStackNavigator({
  screens: {
    Recipes: RecipeScreen,
  },
});

const InventoryStack = createNativeStackNavigator({
  screens: {
    MealPlan: InventoryScreen,
  },
});

const MealPlanStack = createNativeStackNavigator({
  screens: {
    MealPlan: MealPlanScreen,
  },
});

// const SettingsStack = createNativeStackNavigator({
//   screens: {
//     Settings: SettingsScreen,
//   },
// });

const SettingsStack = createNativeStackNavigator({
  screens: {
    Profile: SettingsScreen,
  },
});

const MyTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    HomeStack: {
      screen: HomeScreen,  //can be changed to HomeScreen if you dont want the "Home" Header
      options: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, color, size }) => (
          <Image
            source={
              focused
                ? require('../../assets/images/NavBar_Images/HomeClicked.png')
                : require('../../assets/images/NavBar_Images/Home.png')
            }
            style={{ width: 20, height: 20 }}
          />
        ),
      },
    },
    RecipesStack: {
      screen: RecipeScreen,  //can be changed to SettingsScreen if you dont want the "Settings" Header
      options: {
        tabBarLabel: 'Recipes',
        tabBarIcon: ({ focused, color, size }) => (
          <Image
            source={
              focused
                ? require('../../assets/images/NavBar_Images/RecipesClicked.png')
                : require('../../assets/images/NavBar_Images/Recipes.png')
            }
            style={{ width: 20, height: 20 }}
          />
        ),
      },
    },
    InventoryStack: {
      screen: InventoryScreen,  //can be changed to HomeScreen if you dont want the "Home" Header
      options: {
        tabBarLabel: 'Inventory',
        tabBarIcon: ({ focused, color, size }) => (
          <Image
            source={
              focused
                ? require('../../assets/images/NavBar_Images/InventoryClicked.png')
                : require('../../assets/images/NavBar_Images/Inventory.png')
            }
            style={{ width: 20, height: 20 }}
          />
        ),
      },
    },
    MealPlanStack: {
      screen: MealPlanScreen,  //can be changed to SettingsScreen if you dont want the "Settings" Header
      options: {
        tabBarLabel: 'Meal Plan',
        tabBarIcon: ({ focused, color, size }) => (
          <Image
            source={
              focused
                ? require('../../assets/images/NavBar_Images/MealPlanClicked.png')
                : require('../../assets/images/NavBar_Images/MealPlan.png')
            }
            style={{ width: 20, height: 20 }}
          />
        ),
      },
    },
    // SettingsStack: {
    //   screen: SettingsStack,  //can be changed to SettingsScreen if you dont want the "Settings" Header
    //   options: {
    //     tabBarLabel: 'Settings',
    //     tabBarIcon: ({ focused, color, size }) => (
    //       <Image
    //         source={
    //           focused
    //             ? require('../../assets/images/NavBar_Images/Settings.png')
    //             : require('../../assets/images/NavBar_Images/SettingsClicked.png')
    //         }
    //         style={{ width: 40, height: 40 }}
    //       />
    //     ),
    //   },
    // },
    SettingsStack: {
      screen: SettingsScreen,  //can be changed to ProfileScreen if you dont want the "Profile" Header
      options: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ focused, color, size }) => (
          <Image
            source={
              focused
                ? require('../../assets/images/NavBar_Images/SettingsClicked.png')
                : require('../../assets/images/NavBar_Images/Settings.png')
            }
            style={{ width: 20, height: 20 }}
          />
        ),
      },
    },
  },
});

const Navigation = createStaticNavigation(MyTabs);

export const NavBar = () => {
  return <Navigation />;
};