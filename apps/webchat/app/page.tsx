'use client';

import { useState } from 'react';
import { LanguageSwitcher, PlaceholderCard } from '@pulseia/ui';
import type { Locale } from '@pulseia/shared';
import { getCopy } from '@/i18n';
import { publicEnv } from '@/env';

export default function Page() {
  const [locale, setLocale] = useState<Locale>(publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE);
  const copy = getCopy(locale);

  return (
    <PlaceholderCard title={copy.webchat.title} subtitle={copy.webchat.subtitle}>
      <div className="pulseia-input">
        <input placeholder={copy.webchat.inputPlaceholder} />
        <button type="button">Send</button>
      </div>
      <LanguageSwitcher label={copy.common.language} onChange={setLocale} />
    </PlaceholderCard>
  );
}
