import { router } from './trpc';
import { authRouter } from './routers/auth';
import { recipesRouter } from './routers/recipes';

export const appRouter = router({
  auth: authRouter,
  recipes: recipesRouter,
});

export type AppRouter = typeof appRouter;
