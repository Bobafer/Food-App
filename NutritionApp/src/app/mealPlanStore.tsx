import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findRecipeByName } from './recipeRegistry';

// Shared meal-plan storage. The Meal Plan screen WRITES to this when you pick
// a recipe for a slot; the Home screen READS from it to show what's coming up.
// Both must sit underneath <MealPlanProvider> (it lives in NavBar.tsx).
//
// CHANGED: the plan is now saved to the phone with AsyncStorage, so it
// survives closing the app.

export type PlannedRecipe = { name: string; description: string; image: any };

// Must match the slot names used on the Meal Plan screen AND the labels in
// Home's MEAL_TIMES, plus 'Snack' which only the Meal Plan screen uses.
export type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

type MealPlanContextValue = {
    getMeal: (dateKey: string, slot: MealSlot) => PlannedRecipe | null;
    setMeal: (dateKey: string, slot: MealSlot, recipe: PlannedRecipe) => void;
    // Clears a slot so it goes back to empty.
    removeMeal: (dateKey: string, slot: MealSlot) => void;
};

const MealPlanContext = createContext<MealPlanContextValue | null>(null);

// Same prefix style as the inventory screen's key, to avoid collisions.
const MEAL_PLAN_STORAGE_KEY = '@PickToPlate:mealPlan';

// "YYYY-MM-DD" for a given moment, read in a given IANA timezone
// (en-CA happens to format dates exactly this way). Use this same function
// on the Meal Plan screen when turning the selected calendar day into a key.
export const makeDateKey = (date: Date, timeZone?: string) =>
    new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);

const slotKey = (dateKey: string, slot: MealSlot) => `${dateKey}|${slot}`;

export const MealPlanProvider = ({ children }: { children: React.ReactNode }) => {
    const [plan, setPlan] = useState<Record<string, PlannedRecipe>>({});

    // Becomes true once the saved plan has been read from the phone. We must
    // NOT save anything before this, or the empty starting plan would
    // overwrite what's stored.
    const [hasLoaded, setHasLoaded] = useState(false);

    // --- Load the saved plan once, when the app starts ----------------------
    useEffect(() => {
        const loadPlan = async () => {
            try {
                const raw = await AsyncStorage.getItem(MEAL_PLAN_STORAGE_KEY);
                if (raw) {
                    // Saved shape: { '2026-09-30|Dinner': 'Pizza', ... }
                    const saved: Record<string, string> = JSON.parse(raw);
                    const restored: Record<string, PlannedRecipe> = {};
                    Object.entries(saved).forEach(([key, recipeName]) => {
                        const recipe = findRecipeByName(recipeName);
                        if (recipe) restored[key] = recipe;
                    });
                    // Merge, in case a pick was made before loading finished.
                    setPlan((prev) => ({ ...restored, ...prev }));
                }
            } catch (error) {
                console.log('MEAL PLAN LOAD FAILED:', error);
            } finally {
                setHasLoaded(true);
            }
        };

        loadPlan();
    }, []);

    // --- Save whenever the plan changes (after the first load) --------------
    useEffect(() => {
        if (!hasLoaded) return;

        // Only the recipe NAME is saved; the image comes back from the
        // registry when loading.
        const toSave: Record<string, string> = {};
        Object.entries(plan).forEach(([key, recipe]) => {
            toSave[key] = recipe.name;
        });

        AsyncStorage.setItem(MEAL_PLAN_STORAGE_KEY, JSON.stringify(toSave)).catch((error) =>
            console.log('MEAL PLAN SAVE FAILED:', error)
        );
    }, [plan, hasLoaded]);

    const getMeal = useCallback(
        (dateKey: string, slot: MealSlot) => plan[slotKey(dateKey, slot)] ?? null,
        [plan]
    );

    const setMeal = useCallback(
        (dateKey: string, slot: MealSlot, recipe: PlannedRecipe) => {
            setPlan((prev) => ({ ...prev, [slotKey(dateKey, slot)]: recipe }));
        },
        []
    );

    const removeMeal = useCallback((dateKey: string, slot: MealSlot) => {
        setPlan((prev) => {
            const next = { ...prev };
            delete next[slotKey(dateKey, slot)];
            return next;
        });
    }, []);

    const value = useMemo(() => ({ getMeal, setMeal, removeMeal }), [getMeal, setMeal, removeMeal]);

    return <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>;
};

export const useMealPlan = () => {
    const ctx = useContext(MealPlanContext);
    if (!ctx) throw new Error('useMealPlan must be used inside <MealPlanProvider>');
    return ctx;
};
