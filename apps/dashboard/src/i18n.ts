import { locales, type LocaleKey } from '@pulseia/shared';

export function getCopy(locale: LocaleKey) {
  return locales[locale] ?? locales.en;
}
