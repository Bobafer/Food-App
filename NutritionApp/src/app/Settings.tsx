import { useState, useEffect } from "react";
import {Alert, ScrollView, Pressable, StyleSheet, Text, View, Image, TextInput, SafeAreaView,} from "react-native";
import {GoogleGenAI} from "@google/genai";
import { Asset } from "expo-asset";
import {File} from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ADDED: the "please wait" popup shown while the AI is working.
import { LoadingOverlay } from "./LoadingOverlay";

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_AI_API_KEY
});

const fridgeImage = require("@/assets/Recipe_Images/fridge.jpg");

const callAi = async () => {
  // ADDED: read the user's saved restrictions and turn them into extra text
  // for the AI. Stays an empty string if nothing is saved or selected.
  let restrictionsText = "";
  try {
    const rawSettings = await AsyncStorage.getItem("userSettings");
    if (rawSettings) {
      const saved = JSON.parse(rawSettings);
      const rules: string[] = [];

      if (saved.allergies && saved.allergies.length > 0) {
        rules.push(
          `Allergies/intolerances: ${saved.allergies.join(", ")}. Never suggest a recipe that contains any of these ingredients.`
        );
      }
      if (saved.dietaryRestriction) {
        rules.push(`Diet: ${saved.dietaryRestriction}. Every recipe must fit this diet.`);
      }
      if (saved.protein) rules.push(`Protein intake goal: ${saved.protein}.`);
      if (saved.sugar) rules.push(`Sugar intake goal: ${saved.sugar}.`);
      if (saved.carbs) rules.push(`Carb intake goal: ${saved.carbs}.`);
      if (saved.calorieGoal && saved.calorieGoal > 0) {
        rules.push(
          `Daily calorie goal: about ${saved.calorieGoal} kcal, so keep each suggested meal reasonable for that.`
        );
      }

      if (rules.length > 0) {
        restrictionsText =
          "The user has these restrictions. Follow them strictly:\n- " +
          rules.join("\n- ") +
          "\n\nIf a recipe can't be made within these restrictions using what's in the fridge, don't suggest it.";
      }
    }
  } catch (error) {
    console.log("COULD NOT READ SETTINGS FOR AI:", error);
  }
  console.log("RESTRICTIONS SENT TO AI:", restrictionsText || "(none)");

  const asset = Asset.fromModule(fridgeImage);

  await asset.downloadAsync();

  const response = await fetch(asset.localUri!);
  const blob = await response.blob();

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      // Remove "data:image/jpeg;base64," from the beginning
      const base64Data = result.split(",")[1];

      resolve(base64Data);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const aiResponse = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Look inside this fridge and suggest 5 recipes I can make.",
          },
          // ADDED: the restrictions, sent as an extra text part (skipped if empty)
          ...(restrictionsText ? [{ text: restrictionsText }] : []),
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64,
            },
          },
        ],
      },
    ],
  });

  return aiResponse;
};


const allergies = [
  {
    name: "Peanuts",
    image: require('@/assets/settingsIcons/peanuts.png'),
  },
  {
    name: "Tree Nuts",
    image: require('@/assets/settingsIcons/treeNuts.png'),
  },
  {
    name: "Milk",
    image: require('@/assets/settingsIcons/milk.png'),
  },
  {
    name: "Eggs",
    image: require('@/assets/settingsIcons/eggs.png'),
  },
  {
    name: "Shellfish",
    image: require('@/assets/settingsIcons/shellfish.png'),
  },
  {
    name: "Wheat",
    image: require('@/assets/settingsIcons/wheat.png'),
  },
  {
    name: "Soy",
    image: require('@/assets/settingsIcons/soy.png'),
  },
  {
    name: "Fish",
    image: require('@/assets/settingsIcons/fish.png'),
  },
  {
    name: "Sesame",
    image: require('@/assets/settingsIcons/sesame.png'),
  },
  {
    name: "Gluten",
    image: require('@/assets/settingsIcons/gluten.png'),
  },
];

const dietRestrictions = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "Mediterranean",
];

const macroAmounts = [
  "Low",
  "Moderate",
  "High",
];

const SettingsScreen = () => {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);
  const [selectedMacros1, setSelectedMacros1] = useState<string | null>(null);
  const [selectedMacros2, setSelectedMacros2] = useState<string | null>(null);
  const [selectedMacros3, setSelectedMacros3] = useState<string | null>(null);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [saved, setSaved] = useState(false);
  // ADDED: true while the AI is looking at the photo and coming up with recipes.
  const [isAnalyzing, setIsAnalyzing] = useState(false);  

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem("userSettings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
            setSelectedAllergies(settings.allergies || []);
            setSelectedDiet(settings.dietaryRestriction || null);
            setSelectedMacros1(settings.protein || null);
            setSelectedMacros2(settings.sugar || null);
            setSelectedMacros3(settings.carbs || null);
            setCalorieGoal(settings.calorieGoal || 2000);
          }
          } catch (error) {
            console.log("LOAD FAILED:", error);
          }
        };

        loadSettings();
      }, []);

  // ADDED: auto-save. Writes every change to the phone right away, so nothing
  // is lost if the app is closed without pressing Save.
  //
  // settingsChecked stays false until the saved settings have been read once,
  // so the blank starting defaults can never overwrite real saved data.
  const [settingsChecked, setSettingsChecked] = useState(false);

  useEffect(() => {
    const checkSavedSettings = async () => {
      try {
        await AsyncStorage.getItem("userSettings");
      } catch (error) {
        console.log("SETTINGS CHECK FAILED:", error);
      } finally {
        setSettingsChecked(true);
      }
    };

    checkSavedSettings();
  }, []);

  useEffect(() => {
    if (!settingsChecked) return;

    const settingsToSave = {
      allergies: selectedAllergies,
      dietaryRestriction: selectedDiet,
      protein: selectedMacros1,
      sugar: selectedMacros2,
      carbs: selectedMacros3,
      calorieGoal: calorieGoal,
    };

    AsyncStorage.setItem("userSettings", JSON.stringify(settingsToSave)).catch((error) =>
      console.log("AUTO-SAVE FAILED:", error)
    );
  }, [
    settingsChecked,
    selectedAllergies,
    selectedDiet,
    selectedMacros1,
    selectedMacros2,
    selectedMacros3,
    calorieGoal,
  ]);

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(
        selectedAllergies.filter((item) => item !== allergy)
      );
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  return (
   <SafeAreaView style={styles.safeArea}>
   {/* ADDED: popup with a message, visible only while isAnalyzing is true */}
   <LoadingOverlay visible={isAnalyzing} message="Finding recipes you can make..." /> 
   <View style={styles.header}>
  <View style={{ width: 22 }} />
  <Text style={styles.headerTitle}>Settings</Text>
  <View style={{ width: 22 }} />
</View>

    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}

      
    >

      <Text style={styles.heading}>Allergies & Intolerances</Text>
      <Text style={styles.description}>Select all that apply</Text>
      <View style={styles.pillContainer}>
        {allergies.map((item) => (
          <Pressable
            key={item.name}
            onPress={() => toggleAllergy(item.name)}
            style={[
              styles.pill,
              selectedAllergies.includes(item.name) && styles.selectedPill,
            ]}
          >
            <Image
              source={item.image}
              style={styles.icon}
            />
            <Text
              style={[
                styles.pillText,
                selectedAllergies.includes(item.name) &&
                  styles.selectedPillText,
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>

      
      <Text style={styles.heading}>Dietary Restrictions</Text>
      <Text style={styles.description}>Select one</Text>
      <View style={styles.segmentContainer}>
        {dietRestrictions.map((item, index) => (
          <Pressable
            key={item}
            onPress={() => setSelectedDiet(item)}
            style={[
              styles.segment,
              index === dietRestrictions.length - 1 && {
                borderRightWidth: 0,
            },
              selectedDiet === item && styles.selectedSegment,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selectedDiet === item && styles.selectedPillText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      
      <Text style={styles.heading}>Nutrition Goals</Text>
      <Text style={styles.description}>Protein Intake</Text>
      <View style={styles.segmentContainer}>
        {macroAmounts.map((item, index) => (
          <Pressable
            key={item}
            onPress={() => setSelectedMacros1(item)}
            style={[
              styles.segment,
              index === macroAmounts.length - 1 && {
                borderRightWidth: 0,
            },
              selectedMacros1 === item && styles.selectedSegment,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selectedMacros1 === item && styles.selectedPillText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}

      </View>
      
      <Text style={styles.description}>Sugar Intake</Text>
      <View style={styles.segmentContainer}>
        {macroAmounts.map((item, index) => (
          <Pressable
            key={item}
            onPress={() => setSelectedMacros2(item)}
            style={[
              styles.segment,
              index === macroAmounts.length - 1 && {
                borderRightWidth: 0,
            },
              selectedMacros2 === item && styles.selectedSegment,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selectedMacros2 === item && styles.selectedPillText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}

      </View>

      <Text style={styles.description}>Carbs Intake</Text>
      <View style={styles.segmentContainer}>
        {macroAmounts.map((item, index) => (
          <Pressable
            key={item}
            onPress={() => setSelectedMacros3(item)}
            style={[
              styles.segment,
              index === macroAmounts.length - 1 && {
                borderRightWidth: 0,
            },
              selectedMacros3 === item && styles.selectedSegment,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selectedMacros3 === item && styles.selectedPillText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}

      </View>

      <Text style={styles.description}>Calorie Goal</Text>
      <View style={styles.stepperContainer}>
        <Pressable
          style={styles.stepperButton}
          onPress={() => {
            if (calorieGoal > 0) {
              setCalorieGoal(calorieGoal - 10);
            }
          }}
        >
        <Text style={styles.stepperButtonText}>-</Text>
        </Pressable>

        <TextInput
          style={styles.stepperInput}
          keyboardType="numeric"
          value={calorieGoal.toString()}
          onChangeText={(text) => {
            const value = parseInt(text);
            setCalorieGoal(isNaN(value) ? 0 : value);
          }}
        />
        <Text style={styles.kcalText}>kcal</Text>

        <Pressable
          style={styles.stepperButton}
          onPress={() => setCalorieGoal(calorieGoal + 10)}
        >
        <Text style={styles.stepperButtonText}>+</Text>
        </Pressable>
      </View>
      
      {/* Save Button */}
      <View style={{ marginTop: 20 }}>
      <Pressable
        style={[
        styles.saveButton,
        saved && styles.savedButton,
        ]}
      // async = lets stuff run in the background  
      onPress={async () => {
      try {
        const settings = {
          allergies: selectedAllergies,
          dietaryRestriction: selectedDiet,
          protein: selectedMacros1,
          sugar: selectedMacros2,
          carbs: selectedMacros3,
          calorieGoal: calorieGoal,
        };

        await AsyncStorage.setItem(
          "userSettings",
          JSON.stringify(settings)
        );

        setSaved(true);

        Alert.alert(
          "Saved!",
          "Your preferences have been saved."
        );

        setTimeout(() => setSaved(false), 5000);
      } 
      catch (error) {
        console.log("SAVE FAILED:", error);

        Alert.alert(
          "Error",
          "There was a problem saving your preferences, please try again."
        );
      }
    }}
  >
    <Text style={styles.saveButtonText}>
      {saved ? "Saved!" : "Save"}
    </Text>
  </Pressable>

        {/*API Key Test Button*/}
        <Pressable disabled={isAnalyzing} style={styles.testButton} onPress={async () => {
          setIsAnalyzing(true); // ADDED: show the loading popup
          try {
            console.log("CALLING AI...");

            const response = await callAi();

            console.log("RESPONSE TEXT:", response.text);

            Alert.alert(
              "AI Response",
              response.text || "No response received."
            );

          } catch (error) {
            console.log("AI CALL FAILED!");
            console.log(error);

            Alert.alert(
              "AI Error",
              error instanceof Error ? error.message : String(error)
            );
         } finally {
            // ADDED: always hide the popup, whether the AI call worked or failed
            setIsAnalyzing(false);
          }
        }}
        >
          <Text>{isAnalyzing ? 'Finding recipes...' : 'API Key Test'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  </SafeAreaView> 
    );
  };

const styles = StyleSheet.create({
  // ADDED: lays out the test button.
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  container: {
    padding: 20,
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
  backgroundColor: '#EAF3EA',
  paddingVertical: 16,
  paddingHorizontal: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
headerTitle: {
  position: 'absolute',
  left: 0,
  right: 0,
  textAlign: 'center',
  fontSize: 16,
  fontWeight: '600',
  color: '#3F6647',
},

  icon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginBottom: 8,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 15,
  },

  description: {
    fontSize: 14,
    marginBottom: 10,
  },

  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  pill: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },

  selectedPill: {
    backgroundColor: "green",
  },

  pillText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },

  selectedPillText: {
    color: "white",
    fontWeight: "600",
  },

  segmentContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },

  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },  

  selectedSegment: {
    backgroundColor: "green",
  },

  stepperContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "white",
  borderRadius: 12,
  paddingHorizontal: 15,
  paddingVertical: 10,
  marginBottom: 25,
},

stepperButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#f0f0f0",
  justifyContent: "center",
  alignItems: "center",
},

stepperButtonText: {
  fontSize: 26,
  fontWeight: "600",
},

stepperInput: {
  flex: 1,
  textAlign: "center",
  fontSize: 20,
  fontWeight: "600",
},

kcalText: {
  fontSize: 18,
  fontWeight: "500",
  marginRight: 12,
},

  saveButton: {
  backgroundColor: "green",
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: "center",
},

savedButton: {
  backgroundColor: "#d3d3d3",
},

saveButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600",
},

});

export default SettingsScreen;