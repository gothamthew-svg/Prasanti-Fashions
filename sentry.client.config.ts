// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Replay 10% of sessions, 100% of sessions with errors
  integrations: [
    Sentry.replayIntegration({
      maskAllText:   false,
      blockAllMedia: false,
    }),
  ],

  tracesSampleRate:   0.1,   // 10% of transactions for performance monitoring
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: process.env.NODE_ENV,

  // Don't send errors in dev
  enabled: process.env.NODE_ENV === 'production',
});
