import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { HttpError } from './error';

type Source = 'body' | 'query' | 'params';

export function validate<T>(source: Source, schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const data = req[source];
    const result = schema.safeParse(data);
    if (!result.success) {
      next(
        new HttpError(400, 'VALIDATION_ERROR', 'Invalid request', {
          issues: result.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        }),
      );
      return;
    }
    const existing = (req as Request & { valid?: Partial<Record<Source, unknown>> }).valid ?? {};
    (req as Request & { valid?: Partial<Record<Source, unknown>> }).valid = {
      ...existing,
      [source]: result.data,
    };
    next();
  };
}

export function getValid<T>(req: Request, source: Source): T {
  const v = (req as Request & { valid?: Partial<Record<Source, unknown>> }).valid?.[source] as
    | T
    | undefined;
  if (v === undefined) {
    throw new Error(`getValid(${String(source)}) called before validate middleware`);
  }
  return v;
}
