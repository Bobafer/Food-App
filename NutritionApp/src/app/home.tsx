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
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import pizza from '@/assets/Recipe_Images/pizza.jpg';

const RECOMMENDED_RECIPE = {
    name: 'Pizza',
    description: 'Italian bread with sauce',
    image: pizza,
};

const MEAL_TIMES = [
    { label: 'Breakfast', icon: 'sunny-outline', hour: 8 },
    { label: 'Lunch', icon: 'partly-sunny-outline', hour: 12 },
    { label: 'Dinner', icon: 'moon-outline', hour: 18 },
];

function getClosestMeal(hour: number) {
    let closest = MEAL_TIMES[0];
    let minDistance = Infinity;

    MEAL_TIMES.forEach((meal) => {
        const rawDiff = Math.abs(hour - meal.hour);
        const circularDiff = Math.min(rawDiff, 24 - rawDiff);

        if (circularDiff < minDistance) {
            minDistance = circularDiff;
            closest = meal;
        }
    });

    return closest;
}

const TIME_ZONES = [
    { label: 'Eastern Time', zone: 'America/New_York' },
    { label: 'Central Time', zone: 'America/Chicago' },
    { label: 'Mountain Time', zone: 'America/Denver' },
    { label: 'Pacific Time', zone: 'America/Los_Angeles' },
    { label: 'Alaska Time', zone: 'America/Anchorage' },
    { label: 'Hawaii Time', zone: 'Pacific/Honolulu' },
];

function makeHourFormatter(zone: string) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: 'numeric',
        hourCycle: 'h23',
    });
}

function makeClockDisplayFormatter(zone: string) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export function HomeScreen() {

    const [now, setNow] = useState(new Date());

    const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
    const [zonePickerVisible, setZonePickerVisible] = useState(false);

    const selectedZone = TIME_ZONES[selectedZoneIndex];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);
  
    const hourFormatter = useMemo(
        () => makeHourFormatter(selectedZone.zone),
        [selectedZone.zone]
    );

    const clockDisplayFormatter = useMemo(
        () => makeClockDisplayFormatter(selectedZone.zone),
        [selectedZone.zone]
    );

    const currentHour = parseInt(hourFormatter.format(now), 10);
    const closestMeal = getClosestMeal(currentHour);

    
    const [capturedPhoto, setCapturedPhoto] =
        useState<string | null>(null);
    const [analyzing, setAnalyzing] =
        useState<boolean>(false);
    
        type Ingredient = {
        name: string;
        confidence: 'high' | 'medium' | 'low';
        category:
            | 'Dairy and Eggs'
            | 'Meat'
            | 'Produce'
            | 'Pantry'
            | 'Other';
    };

    type Recipe = {
        name: string;
        description: string;
        ingredients: string[];
        instructions: string[];
    };

    const [ingredients, setIngredients] =
        useState<Ingredient[]>([]);

    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const imageUriToBase64 = async (imageUri: string | URL | Request) => {
        const response = await fetch(imageUri);
        if (!response.ok) {
            throw new Error('Could not read the captured image.');
        }
        //blob = binary data
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                try {                    const result = reader.result;

                    if (typeof result !== 'string') {
                        reject(
                            new Error(
                                'Could not convert image to base64.'
                            )
                        );
                        return;
                    }

                    const base64Data = result.split(',')[1];

                    if (!base64Data) {
                        reject(
                            new Error(
                                'Invalid base64 image data.'
                            )
                        );
                        return;
                    }

                    resolve(base64Data);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read image.'));
            };

            reader.readAsDataURL(blob);
        });
    };

    const analyzeFridgePhoto = async (imageUri: string) => {
        try {
            setAnalyzing(true);

            setIngredients([]);
            setRecipes([]);

            const GEMINI_API_KEY =
                process.env.EXPO_PUBLIC_AI_API_KEY;

            if (!GEMINI_API_KEY) {
                throw new Error(
                    'Gemini API key is missing. Check your .env file.'
                );
            }

            const base64Image = await imageUriToBase64(imageUri);

            const geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        inlineData: {
                                            mimeType: 'image/jpeg',
                                            data: base64Image,
                                        },
                                    },
                                    {
                                        text: `
                                            You are analyzing a photo of a refrigerator for a cooking app called PickToPlate.

                                            Identify the food ingredients that are clearly visible in the refrigerator.

                                            Return ONLY valid JSON in exactly this format:
                                            {
                                                "ingredients": [
                                                    {
                                                        "name": "eggs",
                                                        "confidence": "high",
                                                        "category": "Dairy and Eggs"
                                                    }
                                                ]
                                            }

                                            Rules:
                                            - Only include food ingredients that are actually visible.
                                            - Do not invent ingredients.
                                            - Do not include non-food objects.
                                            - If you see a container but cannot determine what is inside, do not guess.
                                            - Use simple ingredient names.
                                            - Include the category for each ingredient.
                                            - The only categories are:
                                              "Dairy and Eggs", "Meat", "Produce", "Pantry", and "Other".
                                            - Place every ingredient in exactly one of those categories.
                                            - If you are unsure about the category, use "Other".
                                            - Do not include markdown.
                                            - Do not include \`\`\`json.
                                            - Return only the JSON object.
                                        `,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            // Check the first Gemini request before trying to parse it.
            if (!geminiResponse.ok) {
                const errorText = await geminiResponse.text();

                throw new Error(
                    `Gemini ingredient request failed: ${geminiResponse.status} ${errorText}`
                );
            }

            const ingredientResponseData =
                await geminiResponse.json();

            const ingredientText =
                ingredientResponseData?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!ingredientText) {
                throw new Error(
                    'Gemini did not return any ingredients.'
                );
            }

            // Remove markdown code fences if Gemini happens to include them.
            const cleanedIngredientText = ingredientText
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

            const ingredientData =
                JSON.parse(cleanedIngredientText);

            if (!Array.isArray(ingredientData.ingredients)) {
                throw new Error(
                    'Gemini returned an invalid ingredients format.'
                );
            }

            const detectedIngredients: Ingredient[] =
                ingredientData.ingredients;

            setIngredients(detectedIngredients);

            const recipeResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `
                                            You are generating recipes for a cooking app called PickToPlate.

                                            The ingredients detected in the user's refrigerator are:

                                            ${detectedIngredients
                                                .map(
                                                    (ingredient) =>
                                                        ingredient.name
                                                )
                                                .join(', ')}

                                            Generate 5 different meals that primarily use
                                            the ingredients listed above.

                                            Rules:
                                            - Prioritize recipes that use multiple detected ingredients.
                                            - You may assume basic pantry staples such as salt,
                                              pepper, cooking oil, and common seasonings.
                                            - Do not require unusual ingredients that are not listed.
                                            - A recipe may use a small number of additional basic ingredients
                                              if necessary.
                                            - Make the recipes practical for a normal home kitchen.
                                            - Give each recipe a name and short description.
                                            - List the ingredients needed for each recipe.
                                            - Give clear step-by-step cooking instructions.

                                            Return ONLY valid JSON in exactly this format:

                                            {
                                                "recipes": [
                                                    {
                                                        "name": "Spinach and Cheddar Omelet",
                                                        "description": "A simple omelet made with eggs, spinach, and cheddar cheese.",
                                                        "ingredients": [
                                                            "eggs",
                                                            "spinach",
                                                            "cheddar cheese"
                                                        ],
                                                        "instructions": [
                                                            "Whisk the eggs in a bowl.",
                                                            "Cook the spinach in a pan.",
                                                            "Add the eggs and cheddar cheese.",
                                                            "Cook until the eggs are fully set."
                                                        ]
                                                    }
                                                ]
                                            }

                                            Do not include markdown.
                                            Do not include \`\`\`json.
                                            Return only the JSON object.
                                        `,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            // Check the second Gemini request.
            if (!recipeResponse.ok) {
                const errorText = await recipeResponse.text();

                throw new Error(
                    `Gemini recipe request failed: ${recipeResponse.status} ${errorText}`
                );
            }

            const recipeResponseData =
                await recipeResponse.json();

            const recipeText =
                recipeResponseData?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!recipeText) {
                throw new Error(
                    'Gemini did not return any recipes.'
                );
            }

            // Remove markdown code fences if Gemini happens to include them.
            const cleanedRecipeText = recipeText
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

            const recipeData =
                JSON.parse(cleanedRecipeText);

            if (!Array.isArray(recipeData.recipes)) {
                throw new Error(
                    'Gemini returned an invalid recipes format.'
                );
            }
            const detectedRecipes: Recipe[] =
                recipeData.recipes;

            // Store recipes in React state so they appear in the UI.
            setRecipes(detectedRecipes);

        } catch (error) {
            console.error(
                'Error analyzing fridge photo:',
                error
            );

            Alert.alert(
                'Analysis failed',
                error instanceof Error
                    ? error.message
                    : 'Something went wrong while analyzing your fridge photo.'
            );
        } finally {
            // Always stop the loading state.
            setAnalyzing(false);
        }
    };


    // TAKE PHOTO
    const handleTakePhoto = async () => {
        const { status } =
            await ImagePicker.requestCameraPermissionsAsync();

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
            const photoUri = result.assets[0].uri;
            setCapturedPhoto(photoUri);
            analyzeFridgePhoto(photoUri);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    PickToPlate
                </Text>
            </View>

            {/* Live clock */}
            <View style={styles.clockRow}>
                <Ionicons
                    name="time-outline"
                    size={14}
                    color="#5C8A66"
                />

                <Text style={styles.clockLabel}>
                    {selectedZone.label}:
                </Text>

                <Text style={styles.clockValue}>
                    {clockDisplayFormatter.format(now)}
                </Text>

                <TouchableOpacity
                    onPress={() => setZonePickerVisible(true)}
                    hitSlop={{
                        top: 8,
                        bottom: 8,
                        left: 8,
                        right: 8,
                    }}
                    style={styles.zoneDropdownButton}
                >
                    <Ionicons
                        name="caret-down"
                        size={12}
                        color="#5C8A66"
                    />
                </TouchableOpacity>
            </View>

            {/* Timezone picker */}
            <Modal
                visible={zonePickerVisible}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setZonePickerVisible(false)
                }
            >
                <TouchableOpacity
                    style={styles.zoneModalBackdrop}
                    activeOpacity={1}
                    onPress={() =>
                        setZonePickerVisible(false)
                    }
                >
                    <View style={styles.zoneDropdownCard}>
                        {TIME_ZONES.map((zone, index) => {
                            const isSelected =
                                index === selectedZoneIndex;

                            return (
                                <TouchableOpacity
                                    key={zone.zone}
                                    style={styles.zoneOptionRow}
                                    onPress={() => {
                                        setSelectedZoneIndex(index);
                                        setZonePickerVisible(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.zoneOptionText,
                                            isSelected &&
                                                styles.zoneOptionTextSelected,
                                        ]}
                                    >
                                        {zone.label}
                                    </Text>

                                    {isSelected && (
                                        <Ionicons
                                            name="checkmark"
                                            size={16}
                                            color="#3F6647"
                                        />
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
                <Text style={styles.title}>
                    Snap Your Fridge
                </Text>

                {/* CAMERA BUTTON */}
                <TouchableOpacity
                    style={[
                        styles.cameraButton,
                        analyzing && styles.cameraButtonDisabled,
                    ]}
                    activeOpacity={0.85}
                    onPress={handleTakePhoto}
                    disabled={analyzing}
                >
                    <View style={styles.cameraIconCircle}>
                        <Ionicons
                            name="camera-outline"
                            size={40}
                            color="#5C8A66"
                        />
                    </View>

                    <Text style={styles.cameraButtonText}>
                        {analyzing
                            ? 'Analyzing...'
                            : 'Take Photo'}
                    </Text>
                </TouchableOpacity>

                {/* PHOTO PREVIEW */}
                {capturedPhoto && (
                    <Image
                        source={{ uri: capturedPhoto }}
                        style={styles.previewImage}
                    />
                )}

                {/* GEMINI LOADING STATE */}
                {analyzing && (
                    <View style={styles.analyzingContainer}>
                        <ActivityIndicator
                            size="small"
                            color="#3F6647"
                        />

                        <Text style={styles.analyzingText}>
                            Analyzing your fridge...
                        </Text>
                    </View>
                )}

                {/* INGREDIENT RESULTS */}
                {ingredients.length > 0 && !analyzing && (
                    <View style={styles.ingredientsContainer}>
                        <Text style={styles.ingredientsTitle}>
                            Ingredients Found
                        </Text>

                        {ingredients.map(
                            (ingredient, index) => (
                                <View
                                    key={`${ingredient.name}-${index}`}
                                    style={styles.ingredientRow}
                                >
                                    <View style={styles.ingredientLeft}>
                                        <View
                                            style={
                                                styles.ingredientBullet
                                            }
                                        />

                                        <Text
                                            style={
                                                styles.ingredientName
                                            }
                                        >
                                            {ingredient.name}
                                        </Text>
                                    </View>

                                    <Text
                                        style={
                                            styles.ingredientConfidence
                                        }
                                    >
                                        {ingredient.confidence}
                                    </Text>
                                </View>
                            )
                        )}
                    </View>
                )}
                {recipes.length > 0 && !analyzing && (
                    <View style={styles.recipesContainer}>
                        <Text style={styles.recipesTitle}>
                            Recipes for You
                        </Text>

                        {recipes.map((recipe, index) => (
                            <View
                                key={`${recipe.name}-${index}`}
                                style={styles.recipeCard}
                            >
                                <Text style={styles.recipeName}>
                                    {recipe.name}
                                </Text>

                                <Text style={styles.recipeDescription}>
                                    {recipe.description}
                                </Text>

                                <Text style={styles.recipeSectionTitle}>
                                    Ingredients
                                </Text>

                                {recipe.ingredients.map(
                                    (ingredient, ingredientIndex) => (
                                        <Text
                                            key={`${ingredient}-${ingredientIndex}`}
                                            style={styles.recipeIngredient}
                                        >
                                            • {ingredient}
                                        </Text>
                                    )
                                )}

                                <Text style={styles.recipeSectionTitle}>
                                    Instructions
                                </Text>

                                {recipe.instructions.map(
                                    (instruction, instructionIndex) => (
                                        <Text
                                            key={`${recipe.name}-step-${instructionIndex}`}
                                            style={styles.recipeInstruction}
                                        >
                                            {instructionIndex + 1}. {instruction}
                                        </Text>
                                    )
                                )}
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.mealBadge}>
                    <MaterialCommunityIcons
                        name={
                            closestMeal.icon ===
                            'sunny-outline'
                                ? 'weather-sunny'
                                : closestMeal.icon ===
                                  'moon-outline'
                                ? 'weather-night'
                                : 'weather-partly-cloudy'
                        }
                        size={20}
                        color="#3F6647"
                    />

                    <Text style={styles.mealBadgeText}>
                        {closestMeal.label}
                    </Text>
                </View>

                <Text style={styles.caption}>
                    Analyze your ingredients in seconds
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    header: {
        backgroundColor: '#EAF3EA',
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

    cameraButtonDisabled: {
        opacity: 0.7,
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

    analyzingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
        gap: 10,
    },

    analyzingText: {
        fontSize: 15,
        color: '#5C8A66',
        fontWeight: '600',
    },

    ingredientsContainer: {
        width: '100%',
        marginTop: 20,
        backgroundColor: '#EAF3EA',
        borderRadius: 16,
        padding: 18,
    },

    ingredientsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#3F6647',
        marginBottom: 8,
    },

    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: '#D5E3D5',
    },

    ingredientLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    ingredientBullet: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#6FA377',
        marginRight: 10,
    },

    ingredientName: {
        fontSize: 16,
        color: '#22331F',
        fontWeight: '500',
        textTransform: 'capitalize',
    },

    ingredientConfidence: {
        fontSize: 12,
        color: '#5C8A66',
        fontWeight: '600',
        textTransform: 'capitalize',
    },

    recipesContainer: {
        width: '100%',
        marginTop: 20,
    },

    recipesTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#3F6647',
        marginBottom: 12,
    },

    recipeCard: {
        width: '100%',
        backgroundColor: '#F3F6F2',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#D5E3D5',
    },

    recipeName: {
        fontSize: 19,
        fontWeight: '700',
        color: '#22331F',
        marginBottom: 6,
    },

    recipeDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: '#5F6B5F',
        marginBottom: 14,
    },

    recipeSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#3F6647',
        marginTop: 6,
        marginBottom: 5,
    },

    recipeIngredient: {
        fontSize: 14,
        lineHeight: 21,
        color: '#22331F',
        marginLeft: 4,
    },

    recipeInstruction: {
        fontSize: 14,
        lineHeight: 21,
        color: '#22331F',
        marginBottom: 4,
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