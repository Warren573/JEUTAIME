import React from 'react';
import Navigation from './Navigation';

export default function AppShell({ children, navItems, screen, setScreen }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      minHeight: '100dvh',
      background: '#000',
      color: 'white',
      fontFamily: '-apple-system, sans-serif',
      position: 'relative',
    }}>
      {children}
      <Navigation navItems={navItems} screen={screen} setScreen={setScreen} />
    </div>
  );
}
