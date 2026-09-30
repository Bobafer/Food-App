import pizza from '@/assets/Recipe_Images/pizza.jpg';

// A list of every recipe in the app. The meal plan saves only a recipe's
// NAME to the phone (images can't be saved as text), then uses this list to
// turn the name back into the full recipe (name + description + image) when
// the app reopens.
//
// When you add a new recipe to the app, add it here too — the key must be
// the same text as the recipe's `name`. If a saved name isn't found here,
// that saved pick is simply skipped when loading.
export type RegistryRecipe = { name: string; description: string; image: any };

export const RECIPE_REGISTRY: Record<string, RegistryRecipe> = {
    Pizza: {
        name: 'Pizza',
        description: 'Italian bread with sauce',
        image: pizza,
    },
};

export const findRecipeByName = (name: string): RegistryRecipe | null =>
    RECIPE_REGISTRY[name] ?? null;
