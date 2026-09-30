import * as React from 'react';
import { useState } from 'react';
import { Text, View, Image, PanResponder, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './home';
import { Recipe } from './recipe';
import { InventoryScreen } from './inventory';
import SettingsScreen from './Settings';
import { MealPlan } from './mealplanbuttons';
// ADDED: shared meal-plan data, so Home can see what's picked here.
import { MealPlanProvider, useMealPlan } from './mealPlanStore';

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

// RESTORED: this was reset back to a plain placeholder stub at some point —
// this is the full weekly-calendar + per-day meal-planning version we built
// together. Everything below (through the closing brace and mealPlanStyles)
// is unchanged from that version, just dropped back in here.
function MealPlanScreen () {
  React.useEffect(() => {
    console.log('MealPlanScreen mounted');

    return () => console.log('MealPlanScreen unmounted');
  }, []);

  const todayString = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(todayString);

  // CHANGED: planned meals no longer live in this screen's local state.
  // They're in the shared store (mealPlanStore.tsx), keyed by date + slot,
  // so the Home screen can read the same data. `selected` is already a
  // 'YYYY-MM-DD' string, which is exactly the date key the store uses.
  //   getMeal(date, slot)          -> the saved recipe, or null
  //   setMeal(date, slot, recipe)  -> save a recipe
  //   removeMeal(date, slot)       -> delete it (used by the trash button)
  const { getMeal, setMeal, removeMeal } = useMealPlan();
  // ----------------------------------------------------------------------------

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
  // swipeLockRef adds a 0.5s cooldown, but ONLY for swipe-triggered changes
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
    // CHANGED: was a plain <View>. SafeAreaView + the paddingTop in
    // mealPlanStyles.screen keep the calendar from sliding up under the
    // phone's status bar / notch.
    <SafeAreaView style={mealPlanStyles.screen}>
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

      {/* CHANGED: this was a plain <View> with justifyContent: 'center'.
          On a phone, once a meal card expanded (to show "Choose your meal"
          and the recipe list) the content got taller than the screen, and a
          View can't scroll — so the extra part was cut off. A ScrollView
          lets the whole list scroll, so an opened card always fits. */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={mealPlanStyles.slotsContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <MealPlan
          mealimage={'weather-sunny'}
          mealtxt="Breakfast"
          mealname="No Breakfast Currently Selected"
          selectedRecipe={getMeal(selected, 'Breakfast')}
          onSelectRecipe={(recipe) => setMeal(selected, 'Breakfast', recipe)}
          onClearRecipe={() => removeMeal(selected, 'Breakfast')}
        ></MealPlan>
        <MealPlan
          mealimage={'weather-partly-cloudy'}
          mealtxt="Lunch"
          mealname="No Lunch Currently Selected"
          selectedRecipe={getMeal(selected, 'Lunch')}
          onSelectRecipe={(recipe) => setMeal(selected, 'Lunch', recipe)}
          onClearRecipe={() => removeMeal(selected, 'Lunch')}
        ></MealPlan>
        <MealPlan
          mealimage={'weather-night'}
          mealtxt="Dinner"
          mealname="No Dinner Currently Selected"
          selectedRecipe={getMeal(selected, 'Dinner')}
          onSelectRecipe={(recipe) => setMeal(selected, 'Dinner', recipe)}
          onClearRecipe={() => removeMeal(selected, 'Dinner')}
        ></MealPlan>
        <MealPlan
          mealimage={'weather-cloudy'}
          mealtxt="Snack"
          mealname="No Snack Currently Selected"
          selectedRecipe={getMeal(selected, 'Snack')}
          onSelectRecipe={(recipe) => setMeal(selected, 'Snack', recipe)}
          onClearRecipe={() => removeMeal(selected, 'Snack')}
        ></MealPlan>
      </ScrollView>
    </SafeAreaView>
  );
}

const mealPlanStyles = StyleSheet.create({
  // ADDED: white background, plus extra top padding on Android (where the
  // built-in SafeAreaView doesn't account for the status bar by itself).
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
  },
  // ADDED: layout for the scrolling list of meal cards.
  slotsContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
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
      screen: Recipe,  //can be changed to SettingsScreen if you dont want the "Settings" Header
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
  // "independent" tells React Navigation this container is deliberately
  // nested inside another one (expo-router wraps every route in its own
  // NavigationContainer automatically) — without this flag, the two
  // containers fight over context, and screens deep in this tree (like
  // HomeScreen) end up with a broken/undefined `navigation` prop.
  //
  // ADDED: MealPlanProvider wraps the navigation so that BOTH the Home tab
  // and the Meal Plan tab share the same planned-meals data.
  return (
    <MealPlanProvider>
      <Navigation independent />
    </MealPlanProvider>
  );
};
