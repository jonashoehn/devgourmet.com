# Example Recipe with Frontmatter

Copy this into a new recipe to see the frontmatter features in action:

```devscript
---
title: Spicy Thai Basil Chicken
description: Quick and flavorful stir-fry with Thai basil, perfect for weeknight dinners
author: DevGourmet Chef
servings: 4
prepTime: 15 minutes
cookTime: 10 minutes
tags: [thai, spicy, quick, dinner, chicken]
---

// 🌶️ Spicy Thai Basil Chicken
let servings = 4;

// Visual reference
image("Finished Dish", "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800", "Thai Basil Chicken served with rice");

// Protein
add("chicken breast", 500 * servings, "grams");

// Aromatics
add("garlic", 4 * servings, "cloves");
add("thai chili", 3 * servings);
add("thai basil", 1 * servings, "cup");
add("onion", 1 * servings, "medium");

// Sauce
add("soy sauce", 2 * servings, "tbsp");
add("oyster sauce", 1 * servings, "tbsp");
add("fish sauce", 1 * servings, "tsp");
add("sugar", 1 * servings, "tsp");

// Cooking
heat("wok or large pan on high heat");
add("oil", 2, "tbsp");
cook(30, "seconds", "heat oil");

// Stir-fry
add("chicken pieces");
cook(5, "minutes", "stir-fry until golden");

add("garlic and chili", "minced");
cook(1, "minute", "stir until fragrant");

add("onion", "sliced");
cook(2, "minutes");

add("sauce mixture");
cook(2, "minutes", "toss to coat");

add("thai basil leaves");
cook(30, "seconds", "stir until wilted");

serve("hot with jasmine rice");
```

## Features Demonstrated:

### Frontmatter Fields:
- **title**: Recipe name
- **description**: Short description (shows on card)
- **author**: Recipe creator
- **servings**: Number of servings
- **prepTime**: Preparation time
- **cookTime**: Cooking time
- **tags**: Array of tags for filtering

### What You'll See:
1. **On the recipe card**:
   - Description preview
   - Author name with icon
   - Prep and cook times with clock icons
   - Servings count with chef hat icon
   - Small tag badges below

2. **Tag filter section**:
   - All unique tags extracted from your recipes
   - Click to filter recipes (can select multiple)
   - Active tags are highlighted
   - Clear filters button

3. **Recipe counter**:
   - Shows "My Recipes (X)" with filtered count
