/**
 * Home / Landing page
 */
import { renderNavbar } from '../components/navbar.js';
import { navigate }     from '../app.js';
import { state }        from '../app.js';

export function renderHome() {
  const app = document.getElementById('app');

  const wrapper = document.createElement('div');

  wrapper.appendChild(renderNavbar('home'));

  wrapper.innerHTML += `
    <main>
      <!-- Hero -->
      <section class="hero container">
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          Now in early access
        </div>
        <h1 class="hero-title">
          Where great developers<br>
          find <span class="gradient">unicorn</span> opportunities
        </h1>
        <p class="hero-subtitle">
          Showcase your skills, set your availability, and connect with companies
          looking for exactly your expertise. Zero noise, pure signal.
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" id="hero-cta-primary">
            ${state.user ? 'Go to Profile' : 'Create your profile'} →
          </button>
          <button class="btn btn-ghost btn-lg" id="hero-cta-secondary">
            Learn more
          </button>
        </div>
      </section>

      <!-- Stats -->
      <section style="border-top:1px solid var(--clr-border);border-bottom:1px solid var(--clr-border);background:var(--clr-card)">
        <div class="container stats-row">
          <div class="stat-item">
            <div class="stat-value" style="background:linear-gradient(135deg,var(--clr-primary-light),var(--clr-accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">1.2k+</div>
            <div class="stat-label">Developers</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="background:linear-gradient(135deg,var(--clr-primary-light),var(--clr-accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">300+</div>
            <div class="stat-label">Companies</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="background:linear-gradient(135deg,var(--clr-primary-light),var(--clr-accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">95%</div>
            <div class="stat-label">Match rate</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="background:linear-gradient(135deg,var(--clr-primary-light),var(--clr-accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">48h</div>
            <div class="stat-label">Avg. response time</div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="container">
        <div style="text-align:center;padding-top:var(--sp-12)">
          <h2 class="section-heading">Everything you need to stand out</h2>
          <p class="section-subheading">A complete developer profile that speaks for itself</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🧠</div>
            <div class="feature-title">Skills showcase</div>
            <div class="feature-desc">List your tech stack and let your expertise speak. Companies filter by exact skills they need.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📡</div>
            <div class="feature-title">Availability signal</div>
            <div class="feature-desc">Set your mood — full-time, part-time, or freelance. Hiring teams see exactly what you're open to.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔗</div>
            <div class="feature-title">Integrated links</div>
            <div class="feature-desc">GitHub, LinkedIn, and portfolio all in one place. Show your work, not just your resume.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <div class="feature-title">Experience level</div>
            <div class="feature-desc">Junior to Expert — filter-ready tagging ensures you're seen by the right teams.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <div class="feature-title">Verified identity</div>
            <div class="feature-desc">Email-verified accounts create a trusted, spam-free community for everyone.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <div class="feature-title">Profile picture</div>
            <div class="feature-desc">Upload your photo with automatic resizing and CDN delivery via ImageKit.</div>
          </div>
        </div>
      </section>

      <!-- CTA Banner -->
      <section style="padding:var(--sp-12) 0">
        <div class="container">
          <div style="background:linear-gradient(135deg,var(--clr-primary-dim),rgba(232,121,249,0.1));border:1px solid rgba(124,92,252,0.25);border-radius:var(--r-xl);padding:var(--sp-12) var(--sp-8);text-align:center">
            <h2 style="font-size:1.75rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:var(--sp-3)">
              Ready to be discovered?
            </h2>
            <p style="color:var(--clr-muted);max-width:420px;margin:0 auto var(--sp-8)">
              Create your free profile in under 2 minutes and start getting noticed by the right companies.
            </p>
            <button class="btn btn-primary btn-lg" id="hero-cta-bottom">
              ${state.user ? 'View my profile' : 'Get started — it\'s free'} →
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer style="border-top:1px solid var(--clr-border);padding:var(--sp-8) 0">
        <div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--sp-4)">
          <div class="nav-brand" style="font-size:1rem">
            <div class="nav-brand-icon" style="width:24px;height:24px;font-size:.8rem">🦄</div>
            Unicorn
          </div>
          <div style="color:var(--clr-subtle);font-size:.8125rem">
            Built with ❤️ for developers everywhere
          </div>
        </div>
      </footer>
    </main>
  `;

  app.appendChild(wrapper);

  // Bind CTA buttons
  document.getElementById('hero-cta-primary')?.addEventListener('click', () => {
    navigate(state.user ? '/profile' : '/register');
  });
  document.getElementById('hero-cta-secondary')?.addEventListener('click', () => {
    document.querySelector('.features-grid')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('hero-cta-bottom')?.addEventListener('click', () => {
    navigate(state.user ? '/profile' : '/register');
  });
}
