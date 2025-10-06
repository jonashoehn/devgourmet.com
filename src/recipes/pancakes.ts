export const pancakesRecipe = `// 🥞 Classic Pancakes
let servings = 4;

// Dry ingredients
add("flour", 200 * servings, "grams");
add("sugar", 20 * servings, "grams");
add("salt", 2 * servings, "grams");

// Wet ingredients
add("milk", 300 * servings, "ml");
add("egg", 2 * servings);
add("butter", 30 * servings, "grams");

// Preparation
mix("dry ingredients in a bowl");
mix("wet ingredients separately");
pour("wet into dry mixture");
mix("until just combined");

// Resting improves texture
rest(5, "minutes");

// Cooking
cook(3, "minutes");
flip();
cook(2, "minutes");

serve("warm with maple syrup and butter");`;
