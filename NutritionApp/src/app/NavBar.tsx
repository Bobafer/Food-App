import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import { MealPlan } from './mealplanbuttons';




// https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendarScreen.tsx
// https://wix.github.io/react-native-calendars/docs/Components/ExpandableCalendar


// import breakfast from '@/assets/images/cereals.png';
// import lunch from '@/assets/images/lunch.jpg';
// import dinner from '@/assets/images/dinner.png';
// import snack from '@/assets/images/snack.png';

// ADDED: use the real, styled Home screen instead of the placeholder stub
// that used to be defined below (removed to avoid a duplicate declaration).
import { HomeScreen } from './home';

// ADDED: real Recipe screen for the Recipes tab.
import { Recipe } from './recipe';

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

  const todayBtnTheme = ({
    todayButtonTextColor: "#00AAAF"
  });

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

      const [selected, setSelected] = useState(false);
  

  return (
    <>
    <CalendarProvider
        date= {new Date().toISOString().split('T')[0]}

        showTodayButton
        theme={todayBtnTheme}
      
      
      >
        <WeekCalendar testID={'weekcalendar'} firstDay={1} markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
      }}>

        </WeekCalendar>



      </CalendarProvider>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* <RecipeList /> */}

 {/* <Calendar
  
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
      }}

      showTodayButton


      
      theme={{
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: '#60f89a',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#60f89a',
        dayTextColor: '#2d4150',
        textDisabledColor: '#000000'
      }}

    /> */}
     


       <MealPlan mealimage = {"weather-sunny"} mealtxt="Breakfast" mealname="No Breakfast Currently Selected"></MealPlan>
      <MealPlan mealimage = {"weather-partly-cloudy"} mealtxt="Lunch" mealname="No Lunch Currently Selected"></MealPlan>
      <MealPlan mealimage = {'weather-night'} mealtxt="Dinner" mealname="No Dinner Currently Selected"></MealPlan>
      <MealPlan mealimage = {'weather-cloudy'} mealtxt="Snack" mealname="No Snack Currently Selected"></MealPlan> 

    </View></>
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

// REMOVED: the old placeholder `function HomeScreen() {...}` stub that used
// to be here — it's replaced by the real import at the top of this file.

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
    Recipes: Recipe,
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