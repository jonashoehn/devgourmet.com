export const broccoliFusilliRecipe = `// Creamy Broccoli Fusilli
// Prep: 15 mins | Cook: 25 mins | Serves: 4 people

let servings = 4;
let spiceLevel = 2; // 1-3 red chillies

// Ingredients
add("fusilli pasta", 500, "grams");
add("broccoli", 500, "grams");
add("garlic cloves", 2);
add("red chilli", spiceLevel);
add("anchovy fillets", 6);
add("double cream", 200, "ml");
add("olive oil", 50, "ml");
add("salt", 10, "grams");

// Instructions
step("Bring large pot of salted water to boil");
cook(10, "minutes", "Cook broccoli until very tender");
step("Reserve 1 cup of broccoli cooking water");
step("Drain broccoli");

step("In large pan, heat olive oil over medium heat");
step("Add minced garlic, chilli, and chopped anchovies");
cook(3, "minutes", "Sauté until garlic is fragrant and anchovies dissolve");

step("Add cooked broccoli to pan");
step("Mash broccoli into coarse paste with wooden spatula");

step("Pour in double cream and stir to combine");
simmer(5, "minutes", "Let flavors meld");

step("Meanwhile, cook fusilli al dente according to package");
step("Add cooked pasta to pan");
mix("Toss pasta with sauce until evenly coated");

step("Add reserved broccoli water if sauce too thick");
serve("immediately with red pepper flakes or olive oil drizzle");`;
