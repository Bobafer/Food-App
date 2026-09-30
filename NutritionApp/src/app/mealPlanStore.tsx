import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Shared meal-plan storage. The Meal Plan screen WRITES to this when you pick
// a recipe for a slot; the Home screen READS from it to show what's coming up.
// Both must sit underneath <MealPlanProvider> (see index.tsx).

export type PlannedRecipe = { name: string; description: string; image: any };

// Must match the slot names used on the Meal Plan screen AND the labels in
// Home's MEAL_TIMES, plus 'Snack' which only the Meal Plan screen uses.
export type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

type MealPlanContextValue = {
    getMeal: (dateKey: string, slot: MealSlot) => PlannedRecipe | null;
    setMeal: (dateKey: string, slot: MealSlot, recipe: PlannedRecipe) => void;
    // ADDED: clears a slot so it goes back to empty.
    removeMeal: (dateKey: string, slot: MealSlot) => void;
};

const MealPlanContext = createContext<MealPlanContextValue | null>(null);

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
