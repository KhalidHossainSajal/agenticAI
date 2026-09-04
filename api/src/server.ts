import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import businessesRouter from './routes/businesses';
import { errorHandler, notFoundHandler } from './middleware/error';

export function createApp(): express.Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/businesses', businessesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[api] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });
}
