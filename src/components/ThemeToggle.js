import React from 'react';
import haptic, { needsTapLayer } from './haptics';

export default function ThemeToggle({ theme, toggleTheme, className = 'theme-toggle' }) {
  const dark = theme === 'dark';

  return (
    <label className={`${className} theme-switch`}>
      {/* A native switch: on iPhone, Safari plays its own tick when a finger taps it.
          Android has no such tick, so it gets a short vibration instead. */}
      <input
        type="checkbox"
        switch=""
        role="switch"
        aria-label="Dark mode"
        checked={dark}
        onChange={toggleTheme}
        onClick={(event) => {
          if (event.nativeEvent.pointerType === 'touch' && !needsTapLayer()) haptic();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.repeat) toggleTheme();
        }}
      />
      <i className={dark ? 'fas fa-moon' : 'fas fa-sun'} aria-hidden="true" />
    </label>
  );
}
