import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const authRouter = router({
  // Sign up with email and password
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const body: Record<string, unknown> = {
        email: input.email,
        password: input.password,
      };

      if (input.name) {
        body.name = input.name;
      }

      const result = await ctx.auth.api.signUpEmail({ body: body as any });

      return result;
    }),

  // Sign in with email and password
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
      });

      return result;
    }),

  // Sign out
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.auth.api.signOut({
      headers: new Headers(),
    });

    return { success: true };
  }),

  // Get current session
  getSession: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null;
    }

    return {
      user: ctx.user,
    };
  }),
});
