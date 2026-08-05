import * as React from 'react';
import { Text, View, Image } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

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

function RecipesScreen () {
  React.useEffect(() => {
    console.log('RecipesScreen mounted');

    return () => console.log('RecipesScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Recipes Screen</Text>
    </View>
  );
}

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

function ProfileScreen() {
  React.useEffect(() => {
    console.log('ProfileScreen mounted');

    return () => console.log('ProfileScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function HomeScreen() {
  React.useEffect(() => {
    console.log('HomeScreen mounted');

    return () => console.log('HomeScreen unmounted');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
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
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const RecipesStack = createNativeStackNavigator({
  screens: {
    Recipes: RecipesScreen,
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

const ProfileStack = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
  },
});

const MyTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    HomeStack: {
      screen: HomeStack,  //can be changed to HomeScreen if you dont want the "Home" Header
      options: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, color, size }) => (
          <Image
            source={
              focused
                ? require('../../assets/images/NavBar_Images/Home.png')
                : require('../../assets/images/NavBar_Images/HomeClicked.png')
            }
            style={{ width: 40, height: 40 }}
          />
        ),
      },
    },
    RecipesStack: {
      screen: RecipesStack,  //can be changed to SettingsScreen if you dont want the "Settings" Header
      options: {
        tabBarLabel: 'Recipes',
        tabBarIcon: ({ focused, color, size }) => (
          <Image
            source={
              focused
                ? require('../../assets/images/NavBar_Images/Recipes.png')
                : require('../../assets/images/NavBar_Images/RecipesClicked.png')
            }
            style={{ width: 40, height: 40 }}
          />
        ),
      },
    },
    MealPlanStack: {
      screen: MealPlanStack,  //can be changed to SettingsScreen if you dont want the "Settings" Header
      options: {
        tabBarLabel: 'Meal Plan',
        tabBarIcon: ({ focused, color, size }) => (
          <Image
            source={
              focused
                ? require('../../assets/images/NavBar_Images/MealPlan.png')
                : require('../../assets/images/NavBar_Images/MealPlanClicked.png')
            }
            style={{ width: 40, height: 40 }}
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
    Profile: {
      screen: ProfileStack,  //can be changed to ProfileScreen if you dont want the "Profile" Header
      options: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused, color, size }) => (
          <Image
            source={
              focused
                ? require('../../assets/images/NavBar_Images/Profile.png')
                : require('../../assets/images/NavBar_Images/ProfileClicked.png')
            }
            style={{ width: 40, height: 40 }}
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