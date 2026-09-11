import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { useState } from 'react';
import { Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

  const todayString = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(todayString);

  // Adds/subtracts a number of days from a 'YYYY-MM-DD' string, staying in
  // UTC throughout so we don't get off-by-one bugs from local timezone
  // shifts.
  function addDays(dateString, deltaDays) {
    const date = new Date(`${dateString}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + deltaDays);
    return date.toISOString().split('T')[0];
  }

  // Finds the Monday on/before the given date. Used so "next/previous week"
  // always lands exactly on a Monday, regardless of which day was selected
  // beforehand — this is what actually guarantees the "locks to Monday"
  // behavior, rather than just shifting the previously-selected weekday by 7.
  function getMonday(dateString) {
    const date = new Date(`${dateString}T00:00:00Z`);
    const day = date.getUTCDay(); // 0 = Sunday ... 6 = Saturday
    const diffToMonday = day === 0 ? -6 : 1 - day;
    date.setUTCDate(date.getUTCDate() + diffToMonday);
    return date.toISOString().split('T')[0];
  }

  const goToPreviousWeek = () => setSelected((prev) => addDays(getMonday(prev), -7));
  const goToNextWeek = () => setSelected((prev) => addDays(getMonday(prev), 7));

  // --- Self-built week row -----------------------------------------------
  // We stopped relying on react-native-calendars' WeekCalendar to visually
  // track `selected` — it doesn't reliably re-scroll itself when the date
  // changes from outside its own internal swipe gesture, which was exactly
  // why the blue circle updated but the visible week never actually moved.
  // Instead, we compute and render the 7 visible dates ourselves every
  // render, so what's on screen is ALWAYS in sync with `selected` — no
  // separate internal scroll state that can fall out of sync.
  const weekStart = getMonday(selected);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  // ----------------------------------------------------------------------------

  // --- Manual swipe detection, with a debounce ------------------------------
  // Detects a horizontal swipe ourselves (rather than relying on the
  // library's own gesture handling) and calls the EXACT same
  // goToNextWeek/goToPreviousWeek functions the arrow buttons use, so a
  // swipe always behaves identically to a button tap.
  //
  // swipeLockRef adds a 1.5s cooldown, but ONLY for swipe-triggered changes
  // (the arrow buttons below don't check this at all, and stay instantly
  // responsive on every tap). Without this, a single continuous swipe
  // gesture — or a quick flick — could otherwise fire more than once and
  // jump two or more weeks instead of one.
  const SWIPE_THRESHOLD = 50; // pixels of horizontal drag before it counts as a swipe
  const SWIPE_COOLDOWN_MS = 500;
  const swipeLockRef = React.useRef(false);

  const handleSwipeNext = () => {
    if (swipeLockRef.current) return;
    swipeLockRef.current = true;
    goToNextWeek();
    setTimeout(() => {
      swipeLockRef.current = false;
    }, SWIPE_COOLDOWN_MS);
  };

  const handleSwipePrevious = () => {
    if (swipeLockRef.current) return;
    swipeLockRef.current = true;
    goToPreviousWeek();
    setTimeout(() => {
      swipeLockRef.current = false;
    }, SWIPE_COOLDOWN_MS);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx <= -SWIPE_THRESHOLD) {
          handleSwipeNext();
        } else if (gestureState.dx >= SWIPE_THRESHOLD) {
          handleSwipePrevious();
        }
      },
    })
  ).current;
  // ----------------------------------------------------------------------------

  // Label above the calendar, e.g. "January 2022" — based on the week's
  // Monday, so it doesn't flicker between two month names if the selected
  // date happens to be near a month boundary.
  const headerLabel = new Date(`${weekStart}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Header — arrows call goToNextWeek/goToPreviousWeek directly, with
          no debounce, so they're always instantly responsive. */}
      <View style={mealPlanStyles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousWeek} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={20} color="#3F6647" />
        </TouchableOpacity>
        <Text style={mealPlanStyles.calendarHeaderTitle}>{headerLabel}</Text>
        <TouchableOpacity onPress={goToNextWeek} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-forward" size={20} color="#3F6647" />
        </TouchableOpacity>
      </View>

      {/* The week row itself — swipe handlers attached here via panHandlers */}
      <View style={mealPlanStyles.weekRow} {...panResponder.panHandlers}>
        {weekDates.map((dateString) => {
          const dateObj = new Date(`${dateString}T00:00:00Z`);
          const dayLetter = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
          const dayNumber = dateObj.getUTCDate();
          const isSelected = dateString === selected;

          return (
            <TouchableOpacity
              key={dateString}
              style={mealPlanStyles.dayColumn}
              onPress={() => setSelected(dateString)}
            >
              <Text style={mealPlanStyles.dayLetter}>{dayLetter}</Text>
              <View style={[mealPlanStyles.dayNumberCircle, isSelected && mealPlanStyles.dayNumberCircleSelected]}>
                <Text style={[mealPlanStyles.dayNumberText, isSelected && mealPlanStyles.dayNumberTextSelected]}>
                  {dayNumber}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <MealPlan mealimage={'weather-sunny'} mealtxt="Breakfast" mealname="No Breakfast Currently Selected"></MealPlan>
        <MealPlan mealimage={'weather-partly-cloudy'} mealtxt="Lunch" mealname="No Lunch Currently Selected"></MealPlan>
        <MealPlan mealimage={'weather-night'} mealtxt="Dinner" mealname="No Dinner Currently Selected"></MealPlan>
        <MealPlan mealimage={'weather-cloudy'} mealtxt="Snack" mealname="No Snack Currently Selected"></MealPlan>
      </View>
    </View>
  );
}

const mealPlanStyles = StyleSheet.create({
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    marginVertical: 10,
  },
  calendarHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22331F',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  dayColumn: {
    alignItems: 'center',
    width: 40,
  },
  dayLetter: {
    fontSize: 12,
    color: '#9AA39C',
    marginBottom: 6,
  },
  dayNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberCircleSelected: {
    backgroundColor: '#2E6FA3',
  },
  dayNumberText: {
    fontSize: 14,
    color: '#22331F',
  },
  dayNumberTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

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