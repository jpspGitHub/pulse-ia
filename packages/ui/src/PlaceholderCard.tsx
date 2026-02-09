import React from 'react';

type PlaceholderCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function PlaceholderCard({ title, subtitle, children }: PlaceholderCardProps) {
  return (
    <div className="pulseia-card">
      <div className="pulseia-card__header">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children ? <div className="pulseia-card__body">{children}</div> : null}
    </div>
  );
}
