# DevGourmet Frontmatter Guide

## Overview

DevGourmet now supports Astro-style frontmatter in recipes! This allows you to add metadata to your recipes that will be used for better link previews and sharing.

## Frontmatter Syntax

Add a frontmatter block at the **beginning** of your recipe using three dashes (`---`):

```devscript
---
title: Classic Pancakes
description: Fluffy golden pancakes perfect for breakfast - a developer-friendly recipe with adjustable servings
author: DevGourmet Team
servings: 4
prepTime: 10 minutes
cookTime: 15 minutes
tags: [breakfast, quick, family-friendly]
---

// Your recipe code starts here
let servings = 4;
add("flour", 200 * servings, "grams");
// ... rest of recipe
```

## Supported Fields

- **title**: Recipe name (used in share links and meta tags)
- **description**: Brief description (used in Open Graph previews)
- **author**: Recipe creator
- **servings**: Default number of servings (number)
- **prepTime**: Preparation time
- **cookTime**: Cooking time
- **tags**: Array of tags (e.g., `[breakfast, quick, vegetarian]`)

You can add any custom fields you want - they'll be parsed and stored in the metadata.

## Security

All frontmatter values are **automatically sanitized** to prevent XSS attacks. The following characters are escaped:
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#x27;`
- `/` → `&#x2F;`

Images are **not** included in Open Graph meta tags for security reasons.

## Shared Recipe Features

### 1. **Persistent Shared Recipes**
When you receive a shared recipe link, it's stored in localStorage for 24 hours. This means:
- You won't lose the recipe if you refresh the page
- The recipe stays available even if you close and reopen the browser
- After 24 hours, it's automatically cleaned up

### 2. **Descriptive Share Links**
Share links now include the recipe title in the URL:
```
https://devgourmet.com?recipe=abc123&title=Classic%20Pancakes
```

Instead of just:
```
https://devgourmet.com?recipe=abc123
```

### 3. **Open Graph Link Previews**
When sharing a recipe on social media or messaging apps, the link preview will show:
- Recipe title
- Recipe description (from frontmatter)
- DevGourmet branding

## Example Recipe with Frontmatter

```devscript
---
title: Spicy Thai Basil Chicken
description: Quick and flavorful stir-fry with Thai basil, perfect for weeknight dinners
author: Chef Alex
servings: 4
prepTime: 15 minutes
cookTime: 10 minutes
tags: [thai, spicy, quick, dinner]
---

// 🌶️ Spicy Thai Basil Chicken
let servings = 4;

// Protein
add("chicken breast", 500 * servings, "grams");

// Aromatics
add("garlic", 4 * servings, "cloves");
add("thai chili", 3 * servings);
add("thai basil", 1 * servings, "cup");

// Sauce
add("soy sauce", 2 * servings, "tbsp");
add("oyster sauce", 1 * servings, "tbsp");
add("fish sauce", 1 * servings, "tsp");

// Cook
cook(5, "minutes", "Stir-fry chicken until golden");
add("garlic and chili", "minced");
cook(1, "minute");
add("sauce mixture");
cook(2, "minutes");
add("thai basil");
cook(30, "seconds");

serve("hot with jasmine rice");
```

## Notes

- Frontmatter is **optional** - recipes without it will work perfectly fine
- The frontmatter block must be at the **very beginning** of the file
- Each field should be on its own line with the format: `key: value`
- Arrays use square brackets: `tags: [tag1, tag2, tag3]`
- Quotes around values are optional for simple strings
