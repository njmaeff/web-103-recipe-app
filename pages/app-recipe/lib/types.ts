export interface Ingredient {
    name: string;
    amount: string;
}

export interface RecipeDoc {
    id?: string;
    name: string;
    directions: string;
    ingredients: Ingredient[];
}
