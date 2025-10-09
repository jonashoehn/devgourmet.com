import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './api/router';
import { createContext } from './api/trpc';
import { auth } from './auth/config';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL || '',
    ].filter(Boolean),
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// BetterAuth endpoints
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw);
});

// tRPC endpoints
app.all('/api/trpc/*', async (c) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: (opts) => createContext(opts),
  });
  return response;
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message,
    },
    500
  );
});

const port = parseInt(process.env.PORT || '3000');

console.log(`🚀 Server starting on http://localhost:${port}`);
console.log(`📝 tRPC endpoint: http://localhost:${port}/api/trpc`);
console.log(`🔐 Auth endpoint: http://localhost:${port}/api/auth`);

export default {
  port,
  fetch: app.fetch,
};
