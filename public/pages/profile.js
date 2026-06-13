/**
 * Profile page — displays the logged-in user's profile
 */
import { renderNavbar }  from '../components/navbar.js';
import { state, navigate } from '../app.js';

const MOOD_LABELS = {
  FULL_TIME:  '🟢 Open to full-time',
  PART_TIME:  '🟡 Open to part-time',
  FREELANCE:  '🔵 Available for freelance',
};

const EXP_LABELS = {
  JUNIOR:    'Junior',
  MID_LEVEL: 'Mid-Level',
  SENIOR:    'Senior',
  EXPERT:    'Expert',
};

const EXP_BADGE = {
  JUNIOR:    'badge-green',
  MID_LEVEL: 'badge-yellow',
  SENIOR:    'badge-purple',
  EXPERT:    'badge-pink',
};

export function renderProfile() {
  const app  = document.getElementById('app');
  const user = state.user;

  if (!user) { navigate('/login', true); return; }

  const initials    = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const joinDate    = new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  const moodLabel   = MOOD_LABELS[user.mood] || user.mood;
  const expLabel    = EXP_LABELS[user.experience]  || user.experience;
  const expBadge    = EXP_BADGE[user.experience]   || 'badge-purple';

  const wrapper = document.createElement('div');
  wrapper.appendChild(renderNavbar('profile'));

  wrapper.innerHTML += `
    <main class="profile-page container page-enter">
      <!-- Profile header card -->
      <div class="profile-header-card">
        <div class="profile-avatar" id="profile-avatar">
          ${user.profilePictureUrl
            ? `<img src="${user.profilePictureUrl}" alt="${user.firstName}">`
            : initials}
        </div>

        <div class="profile-info">
          <div style="display:flex;align-items:flex-start;gap:var(--sp-3);flex-wrap:wrap">
            <div>
              <div class="profile-name">${user.firstName} ${user.lastName}</div>
              <div class="profile-username">@${user.username}</div>
            </div>
            <div style="margin-left:auto;display:flex;gap:var(--sp-2);flex-wrap:wrap">
              <button class="btn btn-ghost btn-sm" id="profile-edit-btn">✏️ Edit profile</button>
            </div>
          </div>

          <div class="profile-tags">
            <span class="badge ${expBadge}">${expLabel}</span>
            <span class="badge badge-purple">${moodLabel}</span>
            ${user.isVerified ? '<span class="badge badge-green">✓ Verified</span>' : ''}
          </div>

          <div class="profile-links">
            ${user.linkedIn ? `
              <a class="profile-link" href="${user.linkedIn}" target="_blank" rel="noopener">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>` : ''}
            ${user.github ? `
              <a class="profile-link" href="${user.github}" target="_blank" rel="noopener">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                GitHub
              </a>` : ''}
            ${user.portfolio ? `
              <a class="profile-link" href="${user.portfolio}" target="_blank" rel="noopener">
                🌐 Portfolio
              </a>` : ''}
          </div>

          <div style="color:var(--clr-subtle);font-size:.8125rem;margin-top:var(--sp-3)">
            Member since ${joinDate}
            ${user.dob ? ` · Born ${user.dob}` : ''}
            ${user.mobile ? ` · 📱 ${user.mobile}` : ''}
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="card">
        <div class="card-header" style="display:flex;align-items:center;justify-content:space-between">
          <span class="settings-section-title" style="margin:0">Skills</span>
          <span style="color:var(--clr-muted);font-size:.8125rem">${user.skills?.length || 0} skills</span>
        </div>
        <div class="card-body">
          ${user.skills && user.skills.length > 0 ? `
            <div class="skills-cloud">
              ${user.skills.map(s => `<div class="skill-chip">${s}</div>`).join('')}
            </div>
          ` : `
            <div class="empty-state" style="padding:var(--sp-6)">
              <div class="empty-state-icon">🧠</div>
              <div class="empty-state-title">No skills added yet</div>
              <div class="empty-state-desc">Go to Settings to add your skills.</div>
            </div>
          `}
        </div>
      </div>

      <!-- Links & Contact -->
      <div class="card">
        <div class="card-header">
          <span class="settings-section-title" style="margin:0">Links</span>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:var(--sp-4)">
          ${[
            { label: 'LinkedIn',  icon: '💼', url: user.linkedIn },
            { label: 'GitHub',    icon: '💻', url: user.github },
            { label: 'Portfolio', icon: '🌐', url: user.portfolio },
          ].filter(l => l.url).map(l => `
            <div style="display:flex;align-items:center;gap:var(--sp-3)">
              <span style="font-size:1.1rem">${l.icon}</span>
              <div style="flex:1">
                <div style="font-size:.8125rem;color:var(--clr-muted);font-weight:500">${l.label}</div>
                <a href="${l.url}" target="_blank" rel="noopener" style="color:var(--clr-primary-light);font-size:.875rem;word-break:break-all">${l.url}</a>
              </div>
            </div>
          `).join('') || `<div style="color:var(--clr-muted);font-size:.875rem">No links added.</div>`}
        </div>
      </div>
    </main>
  `;

  app.appendChild(wrapper);

  document.getElementById('profile-edit-btn')?.addEventListener('click', () => navigate('/settings'));
}
