import { Router } from 'express';
import { pingDatabase } from '../db/pool';
import { HttpError } from '../middleware/error';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.get('/db', async (_req, res, next) => {
  try {
    await pingDatabase();
    res.status(200).json({ db: 'ok' });
  } catch (err) {
    next(
      new HttpError(
        503,
        'DB_UNAVAILABLE',
        'Database is not reachable',
        err instanceof Error ? err.message : 'unknown',
      ),
    );
  }
});

export default router;
