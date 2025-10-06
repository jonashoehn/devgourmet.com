export const spaghettiRecipe = `// 🍝 Simple Spaghetti Marinara
let servings = 4;
let spiciness = 2; // 1-5 scale

// Pasta
add("spaghetti", 100 * servings, "grams");
add("water", 1000 * servings, "ml");
add("salt", 10 * servings, "grams");

// Sauce
add("tomato", 400 * servings, "grams");
add("garlic", 2 * servings, "cloves");
add("onion", 1 * servings);
add("oil", 30 * servings, "ml");
add("pepper", 2 * spiciness, "grams");

// Cooking pasta
cook(10, "minutes");

// Making sauce
stir("garlic and onion in oil");
cook(3, "minutes");
pour("tomatoes into pan");
season("with salt and pepper");
cook(15, "minutes");

// Combining
mix("pasta with sauce");
serve("hot with parmesan cheese");`;
