import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('PulseIA Webchat'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['en', 'es', 'pt']).default('en'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:4000'),
});

export const publicEnv = EnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
