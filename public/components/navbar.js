/**
 * Shared Navbar component
 */
import { state, navigate, clearUser } from '../app.js';
import { api } from '../utils/api.js';
import { toast } from '../utils/toast.js';

export function renderNavbar(activePage = '') {
  const isLoggedIn = !!state.user;
  const user = state.user;
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';

  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <div class="container navbar-inner">
      <a class="nav-brand" id="nav-brand" href="/" data-link>
        <div class="nav-brand-icon">🦄</div>
        Unicorn
      </a>

      <div class="nav-links" id="nav-links">
        ${!isLoggedIn ? `
          <span class="nav-link ${activePage==='login'?'active':''}" id="nav-login">Sign in</span>
          <span class="btn btn-primary btn-sm" id="nav-register" style="margin-left:4px">Join free</span>
        ` : `
          <span class="nav-link ${activePage==='profile'?'active':''}" id="nav-profile">Profile</span>
          <span class="nav-link ${activePage==='settings'?'active':''}" id="nav-settings">Settings</span>
          <div class="nav-dropdown-wrap">
            <div class="nav-avatar" id="nav-avatar" title="${user.firstName} ${user.lastName}">
              ${user.profilePictureThumbnailUrl
                ? `<img src="${user.profilePictureThumbnailUrl}" alt="avatar">`
                : initials}
            </div>
            <div class="nav-dropdown hidden" id="nav-dropdown">
              <div style="padding:12px 16px;border-bottom:1px solid var(--clr-border)">
                <div style="font-weight:600;font-size:.875rem">${user.firstName} ${user.lastName}</div>
                <div style="color:var(--clr-muted);font-size:.75rem;margin-top:2px">@${user.username}</div>
              </div>
              <div class="dropdown-item" id="dd-profile">👤 View Profile</div>
              <div class="dropdown-item" id="dd-settings">⚙️ Settings</div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item danger" id="dd-logout">↩ Sign out</div>
            </div>
          </div>
        `}
      </div>
    </div>
  `;

  // Bind events
  nav.querySelector('#nav-brand')?.addEventListener('click', e => { e.preventDefault(); navigate('/'); });
  nav.querySelector('#nav-login')?.addEventListener('click', () => navigate('/login'));
  nav.querySelector('#nav-register')?.addEventListener('click', () => navigate('/register'));
  nav.querySelector('#nav-profile')?.addEventListener('click', () => navigate('/profile'));
  nav.querySelector('#nav-settings')?.addEventListener('click', () => navigate('/settings'));

  const avatar = nav.querySelector('#nav-avatar');
  const dropdown = nav.querySelector('#nav-dropdown');
  if (avatar && dropdown) {
    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => dropdown.classList.add('hidden'), { once: true });

    nav.querySelector('#dd-profile')?.addEventListener('click', () => navigate('/profile'));
    nav.querySelector('#dd-settings')?.addEventListener('click', () => navigate('/settings'));
    nav.querySelector('#dd-logout')?.addEventListener('click', async () => {
      try {
        await api.post('/api/v1/auth/logout');
        clearUser();
        toast('success', 'You have been signed out.', 'Goodbye!');
        navigate('/', true);
      } catch {
        toast('error', 'Could not sign out. Please try again.');
      }
    });
  }

  return nav;
}
