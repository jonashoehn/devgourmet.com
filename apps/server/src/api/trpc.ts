import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '../auth/config';
import { db } from '../db';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

// Create context for each request
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  let user = null;

  try {
    // Better Auth automatically reads session from cookies in headers
    const session = await auth.api.getSession({ headers: opts.req.headers });
    user = session?.user || null;
  } catch (error) {
    // Invalid session, user remains null
    console.error('Session validation error:', error);
  }

  return {
    db,
    user,
    auth,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Base router and procedure
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Now TypeScript knows user is not null
    },
  });
});

export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
