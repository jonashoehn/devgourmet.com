export const broccoliFusilliRecipe = `// 🥦 Fusilli with Broccoli, Anchovies & Cream
// Recipe by Theo Randall | Serves: 4 as main course

let servings = 4;
let spiceLevel = 2; // Adjust chillies: 1-3

// Recipe source
resource("Original Recipe", "https://www.huffingtonpost.co.uk/theo-randall/theo-randall-fusilli-with-broccoli-recipe_b_4575680.html");

// Pasta & Main
ingredient("fusilli pasta", 400 * servings / 4, "grams");
ingredient("broccoli", 500 * servings / 4, "grams");

// Aromatics & Flavor
ingredient("garlic cloves", 3 * servings / 4);
ingredient("red chilli", spiceLevel);
ingredient("anchovy fillets", 8 * servings / 4);

// Liquids & Fat
ingredient("double cream", 150 * servings / 4, "ml");
ingredient("extra virgin olive oil", 4 * servings / 4, "tablespoons");
ingredient("salt", 1 * servings / 4, "teaspoon");
ingredient("black pepper", 0.5 * servings / 4, "teaspoon");

// Optional garnish
ingredient("parmesan cheese", 50 * servings / 4, "grams");

// 1. Prepare Broccoli
image("Broccoli Prep", "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=800", "Fresh broccoli florets");
step("Bring large pot of salted water to rolling boil");
step("Cut broccoli into small florets, peel and chop stalks");
cook(8, "minutes");
step("Broccoli should be very soft and tender");
step("Reserve 1 cup (250ml) of cooking water, then drain broccoli");

// 2. Make Sauce Base
step("Heat olive oil in large, deep frying pan over medium heat");
step("Finely chop garlic, slice chilli, roughly chop anchovies");
pour("garlic, chilli, and anchovies into hot oil");
cook(2, "minutes");
step("Stir constantly until garlic is golden and anchovies dissolve");

// 3. Create Broccoli Cream
step("Add drained broccoli to the pan");
step("Using wooden spoon or potato masher, break down broccoli into rough paste");
pour("double cream into the pan");
mix("until cream and broccoli combine into creamy sauce");
season("with salt and pepper to taste");
simmer(3, "minutes");

// 4. Cook & Combine Pasta
step("Meanwhile, cook fusilli in fresh boiling salted water");
cook(9, "minutes");
step("Pasta should be al dente - firm to bite");
step("Drain pasta, reserving another cup of pasta water");

// 5. Finish the Dish
pour("cooked fusilli into broccoli cream sauce");
stir("gently to coat all pasta evenly");
step("Add reserved broccoli/pasta water gradually if sauce too thick");
cook(1, "minutes");
step("Toss everything together over low heat to marry flavors");

// 6. Serve
serve("immediately in warm bowls");
step("Drizzle with extra virgin olive oil");
step("Grate fresh Parmesan over top");
step("Sprinkle with black pepper and red pepper flakes if desired");

// 💡 Chef's Tips
help();`;
