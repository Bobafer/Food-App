import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
} from 'react-native';
import {Ionicons,MaterialCommunityIcons,Feather} from '@expo/vector-icons';

// --- Meal-time logic -------------------------------------------------------
// Each meal has a representative hour (24hr clock). To find the "closest"
// meal for a given hour, we measure the CIRCULAR distance to each one (so
// e.g. 2 AM correctly counts as close to breakfast, not far from it just
// because 2 comes numerically before 8).
const MEAL_TIMES = [
    { label: 'Breakfast', icon: 'sunny-outline', hour: 8 },
    { label: 'Lunch', icon: 'partly-sunny-outline', hour: 12 },
    { label: 'Dinner', icon: 'moon-outline', hour: 18 },
];

function getClosestMeal(hour) {
    let closest = MEAL_TIMES[0];
    let minDistance = Infinity;

    MEAL_TIMES.forEach((meal) => {
        const rawDiff = Math.abs(hour - meal.hour);
        const circularDiff = Math.min(rawDiff, 24 - rawDiff); // wraps around midnight
        if (circularDiff < minDistance) {
            minDistance = circularDiff;
            closest = meal;
        }
    });

    return closest;
}

// --- Real-world Eastern Time --------------------------------------------
// Always reads the current time in America/New_York (Northeast US), REGARDLESS
// of what timezone the device itself is set to. Intl.DateTimeFormat handles
// EST/EDT daylight saving automatically — no manual offset math needed.
const EASTERN_TIME_ZONE = 'America/New_York';

const hourFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: EASTERN_TIME_ZONE,
    hour: 'numeric',
    hourCycle: 'h23', // forces a clean 0-23 range (avoids "24" at midnight)
});

const clockDisplayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: EASTERN_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
});

function getEasternHour(date) {
    return parseInt(hourFormatter.format(date), 10);
}

function formatEasternClock(date) {
    return clockDisplayFormatter.format(date);
}
// ----------------------------------------------------------------------------

export function HomeScreen(){
    // Real, live clock — starts at the actual current moment...
    const [now, setNow] = useState(new Date());

    // ...and ticks forward every second, so the displayed time and the
    // meal badge both stay accurate without needing a refresh.
    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const easternHour = getEasternHour(now);
    const closestMeal = getClosestMeal(easternHour);

    return(
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle='dark-content' />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>PickToPlate</Text>
            </View>

            {/* Live clock, always showing real Eastern Time regardless of the
                device's own timezone setting. */}
            <View style={styles.clockRow}>
                <Ionicons name="time-outline" size={14} color="#5C8A66" />
                <Text style={styles.clockLabel}>Eastern Time:</Text>
                <Text style={styles.clockValue}>{formatEasternClock(now)}</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
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

              {/* Closest-meal badge — driven by the real Eastern Time hour
                  above, via getClosestMeal(easternHour). */}
              <View style={styles.mealBadge}>
                  <MaterialCommunityIcons name={closestMeal.icon === 'sunny-outline' ? 'weather-sunny' : closestMeal.icon === 'moon-outline' ? 'weather-night' : 'weather-partly-cloudy'} size={20} color="#3F6647" />
                  <Text style={styles.mealBadgeText}>{closestMeal.label}</Text>
              </View>

              <Text style={styles.caption}>Analyze your ingridents in seconds</Text>
          </ScrollView>

            {/* The bottom tab bar used to be faked here with a static row of
                icons. It's removed now — NavBar.js renders a REAL tab bar
                (via React Navigation) around this screen instead, so this
                component only needs to be the "Home" tab's content. */}

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
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#F3F6F2',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9E3',
  },
  clockLabel: {
    fontSize: 11,
    color: '#5F6B5F',
    fontWeight: '600',
  },
  clockValue: {
    fontSize: 12,
    color: '#3F6647',
    fontWeight: '700',
  },
  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 40,
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
    maxHeight: 260,
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
  mealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    backgroundColor: '#EAF3EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  mealBadgeText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3F6647',
  },
  caption: {
    marginTop: 50,
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
