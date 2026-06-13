/**
 * Unicorn Frontend — SPA Entry Point
 * Handles routing, auth state, and page rendering
 */

import { renderLogin }    from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderHome }     from './pages/home.js';
import { renderProfile }  from './pages/profile.js';
import { renderSettings } from './pages/settings.js';
import { renderVerifyPending } from './pages/verify-pending.js';
import { toast }          from './utils/toast.js';
import { api }            from './utils/api.js';

// ——— Auth State ———
export const state = {
  user: null,
  token: null,
};

export function setUser(u) { state.user = u; }
export function clearUser() { state.user = null; }

// ——— Router ———
const routes = {
  '/':          () => renderHome(),
  '/login':     () => renderLogin(),
  '/register':  () => renderRegister(),
  '/profile':   () => renderProfile(),
  '/settings':  () => renderSettings(),
  '/verify-pending': () => renderVerifyPending(),
};

export function navigate(path, replace = false) {
  if (replace) {
    history.replaceState(null, '', path);
  } else {
    history.pushState(null, '', path);
  }
  renderRoute(path);
}

function renderRoute(path) {
  const app = document.getElementById('app');
  const handler = routes[path] || routes['/'];

  // Guard protected routes
  const protectedRoutes = ['/profile', '/settings'];
  if (protectedRoutes.includes(path) && !state.user) {
    navigate('/login', true);
    return;
  }

  // Redirect logged-in users away from auth pages
  const authRoutes = ['/login', '/register'];
  if (authRoutes.includes(path) && state.user) {
    navigate('/profile', true);
    return;
  }

  app.className = 'page-enter';
  app.innerHTML = '';
  handler();
}

// ——— Initialise ———
async function init() {
  const loader = document.getElementById('page-loader');

  try {
    // Try to restore session from cookie (server validates cookie)
    const res = await api.get('/api/v1/settings/');
    if (res.success) {
      setUser(res.user);
    }
  } catch (_) {
    // Not logged in, that's fine
  }

  loader.classList.add('hidden');

  // Handle initial route
  renderRoute(window.location.pathname);
}

// ——— Popstate (back/forward) ———
window.addEventListener('popstate', () => {
  renderRoute(window.location.pathname);
});

// Bootstrap
init();
