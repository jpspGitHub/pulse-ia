'use client';

import { useState } from 'react';
import { LanguageSwitcher, PlaceholderCard } from '@pulseia/ui';
import type { Locale } from '@pulseia/shared';
import { getCopy } from '@/i18n';
import { publicEnv } from '@/env';

export default function ProtectedPage() {
  const [locale, setLocale] = useState<Locale>(publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE);
  const copy = getCopy(locale);

  return (
    <PlaceholderCard title={copy.dashboard.title} subtitle={copy.dashboard.protected}>
      <p>This route should be guarded by dashboard JWT auth.</p>
      <LanguageSwitcher label={copy.common.language} onChange={setLocale} />
    </PlaceholderCard>
  );
}
