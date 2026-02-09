import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

export const locales = {
  en,
  es,
  pt,
} as const;

export type LocaleKey = keyof typeof locales;
