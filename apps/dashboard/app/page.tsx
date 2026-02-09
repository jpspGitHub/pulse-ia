'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LanguageSwitcher, PlaceholderCard } from '@pulseia/ui';
import type { Locale } from '@pulseia/shared';
import { getCopy } from '@/i18n';
import { publicEnv } from '@/env';

export default function Page() {
  const [locale, setLocale] = useState<Locale>(publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE);
  const copy = getCopy(locale);

  return (
    <PlaceholderCard title={copy.dashboard.title} subtitle={copy.dashboard.subtitle}>
      <div className="pulseia-card__body">
        <p>Executive-ready KPIs will land here.</p>
        <Link href="/protected" className="pulseia-link">
          View protected route
        </Link>
      </div>
      <LanguageSwitcher label={copy.common.language} onChange={setLocale} />
    </PlaceholderCard>
  );
}
