export * from './pancakes.js';
export * from './spaghetti.js';
export * from './cookies.js';
export * from './broccoli-fusilli.js';

export const demoRecipes = [
  {
    id: 'pancakes',
    title: '🥞 Classic Pancakes',
    description: 'Fluffy pancakes perfect for breakfast',
    difficulty: 'easy' as const,
  },
  {
    id: 'spaghetti',
    title: '🍝 Spaghetti Marinara',
    description: 'Simple Italian pasta with tomato sauce',
    difficulty: 'easy' as const,
  },
  {
    id: 'cookies',
    title: '🍪 Chocolate Chip Cookies',
    description: 'Classic cookies with chocolate chips',
    difficulty: 'medium' as const,
  },
  {
    id: 'broccoli-fusilli',
    title: '🥦 Broccoli Fusilli',
    description: 'Creamy broccoli pasta with anchovies',
    difficulty: 'easy' as const,
  },
];
