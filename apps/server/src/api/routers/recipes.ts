import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { recipes } from '../../db';
import { eq, and, isNull } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { createRecipeSchema, updateRecipeSchema } from '@devgourmet/shared/types';

export const recipesRouter = router({
  // List user's recipes + demo recipes (public recipes with null userId)
  list: publicProcedure.query(async ({ ctx }) => {
    const userRecipes = ctx.user
      ? await ctx.db.query.recipes.findMany({
          where: and(eq(recipes.userId, ctx.user.id), isNull(recipes.deletedAt)),
          orderBy: (recipes, { desc }) => [desc(recipes.updatedAt)],
        })
      : [];

    // Get demo recipes (userId is null)
    const demoRecipes = await ctx.db.query.recipes.findMany({
      where: and(isNull(recipes.userId), isNull(recipes.deletedAt)),
      orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
    });

    return {
      userRecipes,
      demoRecipes,
    };
  }),

  // Get all public recipes (for discovery)
  getPublic: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.recipes.findMany({
      where: and(eq(recipes.isPublic, true), isNull(recipes.deletedAt)),
      orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
    });
  }),

  // Get a single recipe by ID
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.db.query.recipes.findFirst({
        where: and(eq(recipes.id, input.id), isNull(recipes.deletedAt)),
      });

      if (!recipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Recipe not found',
        });
      }

      // Check if user has permission to view this recipe
      if (!recipe.isPublic && recipe.userId !== null) {
        if (!ctx.user || ctx.user.id !== recipe.userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to view this recipe',
          });
        }
      }

      return recipe;
    }),

  // Create a new recipe (requires auth)
  create: protectedProcedure
    .input(createRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      const [recipe] = await ctx.db
        .insert(recipes)
        .values({
          userId: ctx.user.id,
          title: input.title,
          recipeCode: input.recipeCode,
          isPublic: input.isPublic ?? false,
        })
        .returning();

      return recipe;
    }),

  // Update a recipe (requires auth and ownership)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateRecipeSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check ownership
      const existingRecipe = await ctx.db.query.recipes.findFirst({
        where: and(eq(recipes.id, input.id), isNull(recipes.deletedAt)),
      });

      if (!existingRecipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Recipe not found',
        });
      }

      if (existingRecipe.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this recipe',
        });
      }

      // Update recipe
      const [updated] = await ctx.db
        .update(recipes)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(eq(recipes.id, input.id))
        .returning();

      return updated;
    }),

  // Delete a recipe (soft delete, requires auth and ownership)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check ownership
      const existingRecipe = await ctx.db.query.recipes.findFirst({
        where: and(eq(recipes.id, input.id), isNull(recipes.deletedAt)),
      });

      if (!existingRecipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Recipe not found',
        });
      }

      if (existingRecipe.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this recipe',
        });
      }

      // Soft delete
      await ctx.db
        .update(recipes)
        .set({ deletedAt: new Date() })
        .where(eq(recipes.id, input.id));

      return { success: true };
    }),

  // Get shareable URL for a public recipe
  getShareUrl: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.db.query.recipes.findFirst({
        where: and(eq(recipes.id, input.id), isNull(recipes.deletedAt)),
      });

      if (!recipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Recipe not found',
        });
      }

      if (recipe.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to share this recipe',
        });
      }

      if (!recipe.isPublic) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Recipe must be public to generate a share URL',
        });
      }

      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return {
        shareUrl: `${baseUrl}/recipe/${recipe.id}`,
      };
    }),
});
