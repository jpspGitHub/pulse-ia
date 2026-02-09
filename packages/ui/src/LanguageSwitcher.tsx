'use client';

import React, { useEffect, useState } from 'react';
import type { Locale } from '@pulseia/shared';

const SUPPORTED_LOCALES: Locale[] = ['en', 'es', 'pt'];

type LanguageSwitcherProps = {
  label?: string;
  storageKey?: string;
  value?: Locale;
  onChange?: (locale: Locale) => void;
};

export function LanguageSwitcher({
  label = 'Language',
  storageKey = 'pulseia.locale',
  value,
  onChange,
}: LanguageSwitcherProps) {
  const [internalValue, setInternalValue] = useState<Locale>(value ?? 'en');

  useEffect(() => {
    if (value) {
      setInternalValue(value);
      return;
    }

    const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    const browser = typeof navigator !== 'undefined' ? navigator.language?.slice(0, 2) : null;
    const candidate = (stored || browser || 'en') as Locale;
    const nextLocale = SUPPORTED_LOCALES.includes(candidate) ? candidate : 'en';

    setInternalValue(nextLocale);
    onChange?.(nextLocale);
  }, [storageKey, value, onChange]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey, internalValue);
  }, [internalValue, storageKey]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value as Locale;
    setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <label className="pulseia-lang">
      <span>{label}</span>
      <select value={internalValue} onChange={handleChange}>
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
