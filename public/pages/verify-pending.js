/**
 * Verify Pending page — shown after registration
 * Lets user resend verification email
 */
import { api }      from '../utils/api.js';
import { toast }    from '../utils/toast.js';
import { navigate } from '../app.js';

export function renderVerifyPending() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-bg-glow g1"></div>
      <div class="auth-bg-glow g2"></div>

      <div class="auth-card" style="text-align:center">
        <div class="auth-logo" style="justify-content:center">
          <div class="auth-logo-icon">🦄</div>
          <span class="auth-logo-name">Unicorn</span>
        </div>

        <div style="font-size:3.5rem;margin:var(--sp-6) 0">📬</div>

        <h1 class="auth-title" style="font-size:1.4rem">Check your inbox</h1>
        <p style="color:var(--clr-muted);font-size:.875rem;margin-top:var(--sp-3);line-height:1.7">
          We sent a verification link to your email address.<br>
          Click the link to activate your account.
        </p>

        <div style="margin-top:var(--sp-8);background:var(--clr-surface);border:1px solid var(--clr-border);border-radius:var(--r-lg);padding:var(--sp-5)">
          <p style="font-size:.8125rem;color:var(--clr-muted);margin-bottom:var(--sp-4)">Didn't receive the email? Enter your address below.</p>

          <form id="resend-form" novalidate style="display:flex;flex-direction:column;gap:var(--sp-3)">
            <input
              class="form-input"
              type="email"
              id="resend-email"
              placeholder="your@email.com"
              autocomplete="email"
            />
            <div id="resend-error" class="form-error hidden"></div>
            <button type="submit" class="btn btn-primary btn-block" id="resend-btn">
              Resend verification email
            </button>
          </form>
        </div>

        <div style="margin-top:var(--sp-6);display:flex;flex-direction:column;gap:var(--sp-2)">
          <button class="btn btn-ghost btn-block" id="goto-login">← Back to sign in</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('goto-login').addEventListener('click', () => navigate('/login'));

  document.getElementById('resend-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resend-email').value.trim();
    const errEl = document.getElementById('resend-error');
    const btn   = document.getElementById('resend-btn');
    errEl.classList.add('hidden');

    if (!email) {
      errEl.textContent = 'Please enter your email address.';
      errEl.classList.remove('hidden');
      return;
    }

    btn.classList.add('btn-loading');
    btn.disabled = true;

    try {
      await api.post('/api/v1/auth/resend-verification-mail', { mail: email });
      toast('success', 'Verification email sent! Check your inbox.', 'Email sent');
    } catch (ex) {
      errEl.textContent = ex.message || 'Could not resend email. Please try again.';
      errEl.classList.remove('hidden');
    } finally {
      btn.classList.remove('btn-loading');
      btn.disabled = false;
    }
  });
}
