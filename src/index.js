import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// The site used hash URLs (/#/project/x) before moving to real paths. Rewrite any
// old shared link to its new path before the router reads the location.
const { hash } = window.location;
if (hash.startsWith('#/')) {
  const path = hash.slice(1).split('?')[0];
  const normalized = path === '/' ? '/' : path.replace(/\/?$/, '/');
  window.history.replaceState(null, '', normalized);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

