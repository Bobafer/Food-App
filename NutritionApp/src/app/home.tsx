import React, { useState, useEffect, useMemo } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Alert,
    Modal,
} from 'react-native';
import {Ionicons,MaterialCommunityIcons,Feather} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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

// --- Real-world time, selectable timezone -----------------------------------
// Every entry uses an IANA timezone id — Intl.DateTimeFormat reads the real
// current time AS IF you were standing in that zone, and automatically
// handles daylight saving, regardless of what timezone the device itself is
// set to.
const TIME_ZONES = [
    { label: 'Eastern Time', zone: 'America/New_York' },
    { label: 'Central Time', zone: 'America/Chicago' },
    { label: 'Mountain Time', zone: 'America/Denver' },
    { label: 'Pacific Time', zone: 'America/Los_Angeles' },
    { label: 'Alaska Time', zone: 'America/Anchorage' },
    { label: 'Hawaii Time', zone: 'Pacific/Honolulu' },
];

function makeHourFormatter(zone) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: 'numeric',
        hourCycle: 'h23', // forces a clean 0-23 range (avoids "24" at midnight)
    });
}

function makeClockDisplayFormatter(zone) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
// ----------------------------------------------------------------------------

export function HomeScreen(){
    // Real, live clock — starts at the actual current moment...
    const [now, setNow] = useState(new Date());

    // Which timezone's clock/meal-detection we're currently showing.
    // Defaults to Eastern (Northeast US), matching the original behavior.
    const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
    const [zonePickerVisible, setZonePickerVisible] = useState(false);
    const selectedZone = TIME_ZONES[selectedZoneIndex];

    // Holds the URI of whatever photo the user just took, so we can preview
    // it (and, later, hand it off to whatever does the fridge analysis).
    const [capturedPhoto, setCapturedPhoto] = useState(null);

    // ...and ticks forward every second, so the displayed time and the
    // meal badge both stay accurate without needing a refresh.
    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Rebuild the formatters only when the selected zone actually changes,
    // rather than on every tick of the clock.
    const hourFormatter = useMemo(() => makeHourFormatter(selectedZone.zone), [selectedZone.zone]);
    const clockDisplayFormatter = useMemo(() => makeClockDisplayFormatter(selectedZone.zone), [selectedZone.zone]);

    const currentHour = parseInt(hourFormatter.format(now), 10);
    const closestMeal = getClosestMeal(currentHour);

    // Requests camera permission (if not already granted), then opens the
    // native camera. If the user takes a photo (doesn't cancel), its URI
    // gets stored in capturedPhoto.
    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Camera permission needed',
                'PickToPlate needs camera access to scan your fridge.'
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            setCapturedPhoto(result.assets[0].uri);
            // TODO: this is where you'd kick off fridge-photo analysis,
            // e.g. uploading capturedPhoto to your backend/model.
        }
    };

    return(
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle='dark-content' />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>PickToPlate</Text>
            </View>

            {/* Live clock — shows the currently selected timezone. Tap the
                triangle to pick a different one. */}
            <View style={styles.clockRow}>
                <Ionicons name="time-outline" size={14} color="#5C8A66" />
                <Text style={styles.clockLabel}>{selectedZone.label}:</Text>
                <Text style={styles.clockValue}>{clockDisplayFormatter.format(now)}</Text>

                <TouchableOpacity
                    onPress={() => setZonePickerVisible(true)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.zoneDropdownButton}
                >
                    <Ionicons name="caret-down" size={12} color="#5C8A66" />
                </TouchableOpacity>
            </View>

            {/* Timezone picker — a simple dropdown list. Tapping a zone (or
                the backdrop) closes it. */}
            <Modal
                visible={zonePickerVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setZonePickerVisible(false)}
            >
                <TouchableOpacity
                    style={styles.zoneModalBackdrop}
                    activeOpacity={1}
                    onPress={() => setZonePickerVisible(false)}
                >
                    <View style={styles.zoneDropdownCard}>
                        {TIME_ZONES.map((zone, index) => {
                            const isSelected = index === selectedZoneIndex;
                            return (
                                <TouchableOpacity
                                    key={zone.zone}
                                    style={styles.zoneOptionRow}
                                    onPress={() => {
                                        setSelectedZoneIndex(index);
                                        setZonePickerVisible(false);
                                    }}
                                >
                                    <Text style={[styles.zoneOptionText, isSelected && styles.zoneOptionTextSelected]}>
                                        {zone.label}
                                    </Text>
                                    {isSelected && (
                                        <Ionicons name="checkmark" size={16} color="#3F6647" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Snap Your Fridge</Text>

              <TouchableOpacity
              style={styles.cameraButton}
              activeOpacity={0.85}
              onPress={handleTakePhoto}
              >
              <View style={styles.cameraIconCircle}>
                  <Ionicons name="camera-outline" size = {40} color = "#5C8A66" />
              </View>
              <Text style={styles.cameraButtonText}>Take Photo</Text>
              </TouchableOpacity>

              {/* Preview of the photo just taken, if any. Remove this once
                  you're navigating straight to an analysis/results screen
                  instead of staying on Home after a capture. */}
              {capturedPhoto && (
                  <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
              )}

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
  zoneDropdownButton: {
    marginLeft: 2,
    padding: 2,
  },
  zoneModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 30, 20, 0.25)',
    alignItems: 'center',
    paddingTop: 90,
  },
  zoneDropdownCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 6,
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
  },
  zoneOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  zoneOptionText: {
    fontSize: 14,
    color: '#22331F',
  },
  zoneOptionTextSelected: {
    fontWeight: '700',
    color: '#3F6647',
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
  previewImage: {
    width: '100%',
    aspectRatio: 1.6,
    maxHeight: 260,
    borderRadius: 16,
    marginTop: 16,
    backgroundColor: '#E5E5E5',
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
