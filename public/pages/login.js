/**
 * Login page
 */
import { api }      from '../utils/api.js';
import { toast }    from '../utils/toast.js';
import { navigate, setUser } from '../app.js';

export function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-bg-glow g1"></div>
      <div class="auth-bg-glow g2"></div>

      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-icon">🦄</div>
          <span class="auth-logo-name">Unicorn</span>
        </div>

        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-subtitle">Sign in to your developer profile</p>

        <form class="auth-form" id="login-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="login-identifier">
              Username or email <span class="required">*</span>
            </label>
            <div class="input-wrap">
              <span class="input-icon left">@</span>
              <input
                class="form-input input-icon-left"
                type="text"
                id="login-identifier"
                name="identifier"
                placeholder="username or email@domain.com"
                autocomplete="username"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <label class="form-label" for="login-password">
                Password <span class="required">*</span>
              </label>
            </div>
            <div class="input-wrap">
              <span class="input-icon left">🔑</span>
              <input
                class="form-input input-icon-left input-icon-right"
                type="password"
                id="login-password"
                name="password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
              <span class="input-icon right" id="toggle-pw" title="Show/hide password">👁</span>
            </div>
          </div>

          <div id="login-error" class="form-error hidden"></div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-btn">
            Sign in
          </button>
        </form>

        <div class="divider-text" style="margin-top:var(--sp-6)">or</div>

        <div style="text-align:center;margin-top:var(--sp-4)">
          <p class="text-sm text-muted">
            Don't have an account?
            <span class="auth-link" id="go-register">Create one free →</span>
          </p>
          <p class="text-sm text-muted" style="margin-top:var(--sp-3)">
            Need to verify email?
            <span class="auth-link" id="go-verify">Resend verification</span>
          </p>
        </div>
      </div>
    </div>
  `;

  // Navigation links
  document.getElementById('go-register').addEventListener('click', () => navigate('/register'));
  document.getElementById('go-verify').addEventListener('click', () => navigate('/verify-pending'));

  // Toggle password visibility
  const pwInput = document.getElementById('login-password');
  document.getElementById('toggle-pw').addEventListener('click', () => {
    pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  });

  // Form submit
  const form = document.getElementById('login-form');
  const btn  = document.getElementById('login-btn');
  const errEl = document.getElementById('login-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.classList.add('hidden');

    const identifier = document.getElementById('login-identifier').value.trim();
    const password   = document.getElementById('login-password').value;

    if (!identifier || !password) {
      errEl.textContent = 'Please fill in all fields.';
      errEl.classList.remove('hidden');
      return;
    }

    // Determine if identifier is email or username
    const isEmail = identifier.includes('@');
    const body = isEmail
      ? { mail: identifier, password }
      : { username: identifier, password };

    btn.classList.add('btn-loading');
    btn.disabled = true;

    try {
      const res = await api.post('/api/v1/auth/login', body);
      setUser(res.user);
      toast('success', `Welcome back, ${res.user.firstName}!`, 'Signed in');
      navigate('/profile', true);
    } catch (err) {
      errEl.textContent = err.message || 'Invalid credentials.';
      errEl.classList.remove('hidden');

      // If unverified, offer resend
      if (err.status === 403 && err.message?.includes('verify')) {
        errEl.innerHTML = `${err.message} <span class="auth-link" id="resend-from-err">Resend email</span>`;
        document.getElementById('resend-from-err')?.addEventListener('click', () => navigate('/verify-pending'));
      }
    } finally {
      btn.classList.remove('btn-loading');
      btn.disabled = false;
    }
  });
}
