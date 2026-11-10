import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Old browsers (no "js" class, see public/index.html) keep the prerendered static
// page as-is: starting React there could fail mid-render and blank the page.
const canRunApp = document.documentElement.classList.contains('js');

// The site used hash URLs (/#/project/x) before moving to real paths. Rewrite any
// old shared link to its new path before the router reads the location.
const { hash } = window.location;
if (canRunApp && hash.startsWith('#/')) {
  const path = hash.slice(1).split('?')[0];
  const normalized = path === '/' ? '/' : path.replace(/\/?$/, '/');
  window.history.replaceState(null, '', normalized);
}

if (canRunApp) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

