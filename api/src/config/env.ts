import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1).default('change-me'),
  ENCRYPTION_KEY: z.string().min(1).default('change-me-32-bytes-hex-here-change-me'),
  GEMINI_API_KEY: z.string().optional().default(''),
  OPENAI_API_KEY: z.string().optional().default(''),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[env] invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
