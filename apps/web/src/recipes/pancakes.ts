export const pancakesRecipe = `---
title: Classic Pancakes
description: Fluffy golden pancakes perfect for breakfast - a developer-friendly recipe with adjustable servings
author: DevGourmet Team
servings: 4
prepTime: 10 minutes
cookTime: 15 minutes
tags: [breakfast, quick, family-friendly]
---

// 🥞 Classic Pancakes
let servings = 4;

// Visual references
image("Finished Pancakes", "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800", "Golden fluffy pancakes stacked");
image("Batter Consistency", "https://images.unsplash.com/photo-1589627461407-6257b1acf0fd?w=800", "Proper batter texture");

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
