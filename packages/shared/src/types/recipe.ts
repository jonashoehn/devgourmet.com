import { z } from 'zod';

// Recipe schema
export const recipeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  title: z.string().min(1).max(200),
  recipeCode: z.string(),
  isPublic: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type Recipe = z.infer<typeof recipeSchema>;

// Input schemas for API
export const createRecipeSchema = z.object({
  title: z.string().min(1).max(200),
  recipeCode: z.string(),
  isPublic: z.boolean().optional().default(false),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

export const updateRecipeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  recipeCode: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;

// User schema (basic, BetterAuth manages full user)
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
