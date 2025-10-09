export const cookiesRecipe = `// 🍪 Chocolate Chip Cookies
let servings = 24; // Makes 24 cookies
let sweetness = 3; // 1-5 scale

// Dry ingredients
add("flour", 280, "grams");
add("salt", 2, "grams");

// Wet ingredients
add("butter", 170, "grams");
add("sugar", 100 + (20 * sweetness), "grams");
add("egg", 2);
add("vanilla", 5, "ml");

// The star ingredient
add("chocolate", 200, "grams");

// Preparation
mix("butter and sugar until creamy");
add("egg", 2);
add("vanilla", 5, "ml");
mix("until well combined");

// Add dry ingredients
mix("flour and salt into wet mixture");
add("chocolate", 200, "grams");
mix("until just combined");

// Chill for better texture
rest(30, "minutes");

// Baking
bake(12, "minutes");
rest(5, "minutes");

serve("warm with cold milk");`;
