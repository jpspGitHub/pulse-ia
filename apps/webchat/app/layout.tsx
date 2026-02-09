import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'PulseIA Webchat',
  description: 'PulseIA Webchat placeholder',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
