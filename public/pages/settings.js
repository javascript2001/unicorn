/**
 * Settings page — update profile, upload avatar
 */
import { renderNavbar }         from '../components/navbar.js';
import { state, setUser, navigate } from '../app.js';
import { api }                  from '../utils/api.js';
import { toast }                from '../utils/toast.js';

let skillsList = [];
let activeTab  = 'profile';

export function renderSettings() {
  const app  = document.getElementById('app');
  const user = state.user;
  if (!user) { navigate('/login', true); return; }

  skillsList = [...(user.skills || [])];

  const wrapper = document.createElement('div');
  wrapper.appendChild(renderNavbar('settings'));

  wrapper.innerHTML += `
    <main class="settings-page container page-enter">
      <div style="margin-bottom:var(--sp-8)">
        <h1 style="font-size:1.75rem;font-weight:700;letter-spacing:-0.02em">Settings</h1>
        <p style="color:var(--clr-muted);margin-top:var(--sp-2);font-size:.9375rem">Manage your developer profile and account</p>
      </div>

      <div class="settings-layout">
        <!-- Sidebar -->
        <aside class="settings-sidebar">
          <div class="settings-nav-item active" data-tab="profile">👤 Profile</div>
          <div class="settings-nav-item" data-tab="avatar">🖼️ Avatar</div>
          <div class="settings-nav-item" data-tab="developer">🧠 Dev Info</div>
          <div class="settings-nav-item" data-tab="links">🔗 Links</div>
        </aside>

        <!-- Content -->
        <div class="settings-content" id="settings-panels">
          <!-- Profile Panel -->
          <div id="panel-profile" class="settings-panel">
            <div class="card">
              <div class="card-header">
                <div class="settings-section-title">Personal Information</div>
              </div>
              <form class="card-body" id="form-profile" novalidate>
                <div style="display:flex;flex-direction:column;gap:var(--sp-5)">
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label" for="s-first">First name</label>
                      <input class="form-input" type="text" id="s-first" value="${esc(user.firstName)}" />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="s-last">Last name</label>
                      <input class="form-input" type="text" id="s-last" value="${esc(user.lastName)}" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="s-username">Username</label>
                    <div class="input-wrap">
                      <span class="input-icon left" style="font-size:.85rem">@</span>
                      <input class="form-input input-icon-left" type="text" id="s-username" value="${esc(user.username)}" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="s-dob">Date of birth</label>
                    <input class="form-input" type="date" id="s-dob" value="${esc(user.dob)}" />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="s-mobile">Mobile</label>
                    <input class="form-input" type="tel" id="s-mobile" value="${esc(user.mobile || '')}" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div id="profile-err" class="form-error hidden" style="margin-top:var(--sp-4)"></div>

                <div class="card-footer" style="display:flex;justify-content:flex-end;margin-top:var(--sp-6);padding:0;border:none">
                  <button type="submit" class="btn btn-primary" id="profile-save-btn">Save changes</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Avatar Panel -->
          <div id="panel-avatar" class="settings-panel hidden">
            <div class="card">
              <div class="card-header">
                <div class="settings-section-title">Profile Picture</div>
              </div>
              <div class="card-body" style="display:flex;flex-direction:column;gap:var(--sp-6)">
                <!-- Preview -->
                <div style="display:flex;align-items:center;gap:var(--sp-5)">
                  <div class="profile-avatar" id="avatar-preview-circle" style="width:80px;height:80px;font-size:1.8rem">
                    ${user.profilePictureUrl
                      ? `<img src="${user.profilePictureUrl}" alt="avatar" id="avatar-img-preview">`
                      : `<span id="avatar-initials-preview">${user.firstName[0]}${user.lastName[0]}</span>`}
                  </div>
                  <div>
                    <div style="font-weight:600;font-size:.9375rem">${user.firstName} ${user.lastName}</div>
                    <div style="color:var(--clr-muted);font-size:.8125rem;margin-top:var(--sp-1)">@${user.username}</div>
                  </div>
                </div>

                <!-- Upload zone -->
                <label class="avatar-uploader" for="avatar-file-input" id="avatar-drop-zone">
                  <div style="font-size:2rem">📁</div>
                  <div>
                    <div class="avatar-info-title">Click to upload a photo</div>
                    <div class="avatar-info-sub">JPG, PNG or GIF · Max 5 MB</div>
                  </div>
                  <input type="file" id="avatar-file-input" accept="image/*" class="sr-only" />
                </label>

                <div id="avatar-selected" class="hidden" style="display:flex;align-items:center;gap:var(--sp-4);background:var(--clr-surface);border:1px solid var(--clr-border);border-radius:var(--r-md);padding:var(--sp-4)">
                  <img id="avatar-thumb" style="width:48px;height:48px;border-radius:50%;object-fit:cover" src="" alt="" />
                  <div style="flex:1">
                    <div id="avatar-filename" style="font-size:.875rem;font-weight:500"></div>
                    <div id="avatar-filesize" style="color:var(--clr-muted);font-size:.75rem;margin-top:2px"></div>
                  </div>
                  <button class="btn btn-ghost btn-sm" id="avatar-clear">✕</button>
                </div>

                <div id="avatar-err" class="form-error hidden"></div>

                <button class="btn btn-primary" id="avatar-upload-btn" disabled>Upload photo</button>
              </div>
            </div>
          </div>

          <!-- Dev Info Panel -->
          <div id="panel-developer" class="settings-panel hidden">
            <div class="card">
              <div class="card-header">
                <div class="settings-section-title">Developer Information</div>
              </div>
              <form class="card-body" id="form-devinfo" novalidate>
                <div style="display:flex;flex-direction:column;gap:var(--sp-5)">
                  <div class="form-group">
                    <label class="form-label">Skills</label>
                    <div class="tag-input-wrap" id="s-skills-wrap">
                      <input class="tag-text-input" id="s-skills-input" placeholder="Type a skill and press Enter" />
                    </div>
                    <span class="form-hint">Press Enter or comma to add · Backspace to remove last</span>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="s-experience">Experience level</label>
                    <select class="form-input form-select" id="s-experience">
                      <option value="" disabled>Select level</option>
                      <option value="JUNIOR"    ${user.experience==='JUNIOR'?'selected':''}>Junior (&lt; 2 years)</option>
                      <option value="MID_LEVEL" ${user.experience==='MID_LEVEL'?'selected':''}>Mid-Level (2–5 years)</option>
                      <option value="SENIOR"    ${user.experience==='SENIOR'?'selected':''}>Senior (5–9 years)</option>
                      <option value="EXPERT"    ${user.experience==='EXPERT'?'selected':''}>Expert (10+ years)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="s-mood">Availability</label>
                    <select class="form-input form-select" id="s-mood">
                      <option value="" disabled>Select availability</option>
                      <option value="FULL_TIME"  ${user.mood==='FULL_TIME'?'selected':''}>Full-time</option>
                      <option value="PART_TIME"  ${user.mood==='PART_TIME'?'selected':''}>Part-time</option>
                      <option value="FREELANCE"  ${user.mood==='FREELANCE'?'selected':''}>Freelance / Contract</option>
                    </select>
                  </div>
                </div>

                <div id="devinfo-err" class="form-error hidden" style="margin-top:var(--sp-4)"></div>

                <div style="display:flex;justify-content:flex-end;margin-top:var(--sp-6)">
                  <button type="submit" class="btn btn-primary" id="devinfo-save-btn">Save changes</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Links Panel -->
          <div id="panel-links" class="settings-panel hidden">
            <div class="card">
              <div class="card-header">
                <div class="settings-section-title">Professional Links</div>
              </div>
              <form class="card-body" id="form-links" novalidate>
                <div style="display:flex;flex-direction:column;gap:var(--sp-5)">
                  <div class="form-group">
                    <label class="form-label" for="s-linkedin">💼 LinkedIn URL</label>
                    <input class="form-input" type="url" id="s-linkedin" value="${esc(user.linkedIn || '')}" placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="s-github">💻 GitHub URL</label>
                    <input class="form-input" type="url" id="s-github" value="${esc(user.github || '')}" placeholder="https://github.com/username" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="s-portfolio">🌐 Portfolio URL <span style="color:var(--clr-subtle);font-weight:400">(optional)</span></label>
                    <input class="form-input" type="url" id="s-portfolio" value="${esc(user.portfolio || '')}" placeholder="https://yoursite.com" />
                  </div>
                </div>

                <div id="links-err" class="form-error hidden" style="margin-top:var(--sp-4)"></div>

                <div style="display:flex;justify-content:flex-end;margin-top:var(--sp-6)">
                  <button type="submit" class="btn btn-primary" id="links-save-btn">Save links</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

  app.appendChild(wrapper);

  // Tab switching
  document.querySelectorAll('.settings-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activeTab = item.dataset.tab;
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.add('hidden'));
      document.getElementById(`panel-${activeTab}`)?.classList.remove('hidden');
    });
  });

  // Profile form
  document.getElementById('form-profile').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSection('profile-save-btn', 'profile-err', {
      firstName: document.getElementById('s-first').value.trim() || undefined,
      lastName:  document.getElementById('s-last').value.trim()  || undefined,
      username:  document.getElementById('s-username').value.trim() || undefined,
      dob:       document.getElementById('s-dob').value.trim()   || undefined,
      mobile:    document.getElementById('s-mobile').value.trim() || undefined,
    });
  });

  // Skills tag input
  initSettingsSkills();

  // Dev info form
  document.getElementById('form-devinfo').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSection('devinfo-save-btn', 'devinfo-err', {
      skills:     skillsList.length ? skillsList : undefined,
      experience: document.getElementById('s-experience').value || undefined,
      mood:       document.getElementById('s-mood').value       || undefined,
    });
  });

  // Links form
  document.getElementById('form-links').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSection('links-save-btn', 'links-err', {
      linkedIn:  document.getElementById('s-linkedin').value.trim()  || undefined,
      github:    document.getElementById('s-github').value.trim()    || undefined,
      portfolio: document.getElementById('s-portfolio').value.trim() || undefined,
    });
  });

  // Avatar
  initAvatarUpload(user);
}

async function saveSection(btnId, errId, data) {
  const btn = document.getElementById(btnId);
  const err = document.getElementById(errId);
  err.classList.add('hidden');

  // Remove undefined values
  Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

  if (Object.keys(data).length === 0) {
    toast('info', 'Nothing to update.', 'No changes');
    return;
  }

  btn.classList.add('btn-loading');
  btn.disabled = true;

  try {
    const res = await api.patch('/api/v1/settings/', data);
    setUser({ ...state.user, ...res.user });
    toast('success', 'Your changes have been saved.', 'Profile updated');
  } catch (ex) {
    err.textContent = ex.message || 'Could not save changes.';
    err.classList.remove('hidden');
  } finally {
    btn.classList.remove('btn-loading');
    btn.disabled = false;
  }
}

function initSettingsSkills() {
  const input = document.getElementById('s-skills-input');
  const wrap  = document.getElementById('s-skills-wrap');

  // Populate existing skills
  skillsList.forEach(skill => renderSkillTag(skill, wrap, input));

  function addSkill(value) {
    const skill = value.trim().replace(/,+$/, '').trim();
    if (!skill || skillsList.includes(skill)) return;
    skillsList.push(skill);
    renderSkillTag(skill, wrap, input);
    input.value = '';
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input.value);
    } else if (e.key === 'Backspace' && !input.value && skillsList.length) {
      const last = skillsList[skillsList.length - 1];
      skillsList.pop();
      wrap.querySelector(`.tag-remove[data-skill="${CSS.escape(last)}"]`)?.closest('.tag')?.remove();
    }
  });

  input.addEventListener('blur', () => { if (input.value.trim()) addSkill(input.value); });
  wrap.addEventListener('click', () => input.focus());
}

function renderSkillTag(skill, wrap, input) {
  const tag = document.createElement('div');
  tag.className = 'tag';
  tag.innerHTML = `${skill}<span class="tag-remove" data-skill="${skill}">×</span>`;
  wrap.insertBefore(tag, input);
  tag.querySelector('.tag-remove').addEventListener('click', () => {
    skillsList = skillsList.filter(s => s !== skill);
    tag.remove();
  });
}

function initAvatarUpload(user) {
  const fileInput   = document.getElementById('avatar-file-input');
  const selectedDiv = document.getElementById('avatar-selected');
  const thumb       = document.getElementById('avatar-thumb');
  const filename    = document.getElementById('avatar-filename');
  const filesize    = document.getElementById('avatar-filesize');
  const clearBtn    = document.getElementById('avatar-clear');
  const uploadBtn   = document.getElementById('avatar-upload-btn');
  const errEl       = document.getElementById('avatar-err');
  let selectedFile  = null;

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      errEl.textContent = 'File must be under 5 MB.';
      errEl.classList.remove('hidden');
      return;
    }

    errEl.classList.add('hidden');
    selectedFile = file;
    const url = URL.createObjectURL(file);
    thumb.src = url;
    filename.textContent = file.name;
    filesize.textContent = (file.size / 1024).toFixed(1) + ' KB';
    selectedDiv.classList.remove('hidden');
    uploadBtn.disabled = false;
  });

  clearBtn.addEventListener('click', () => {
    fileInput.value = '';
    selectedFile = null;
    selectedDiv.classList.add('hidden');
    uploadBtn.disabled = true;
  });

  uploadBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    errEl.classList.add('hidden');
    uploadBtn.classList.add('btn-loading');
    uploadBtn.disabled = true;

    const form = new FormData();
    form.append('img', selectedFile);

    try {
      const res = await api.upload('/api/v1/auth/upload/profilePicture', form);
      setUser({ ...state.user, profilePictureUrl: res.profilePictureUrl, profilePictureThumbnailUrl: res.profilePictureThumbnailUrl });

      // Update avatar preview
      const circle = document.getElementById('avatar-preview-circle');
      circle.innerHTML = `<img src="${res.profilePictureUrl}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;

      toast('success', 'Profile picture updated!', 'Upload complete');
      fileInput.value = '';
      selectedFile = null;
      selectedDiv.classList.add('hidden');
    } catch (ex) {
      errEl.textContent = ex.message || 'Upload failed. Please try again.';
      errEl.classList.remove('hidden');
    } finally {
      uploadBtn.classList.remove('btn-loading');
      uploadBtn.disabled = false;
    }
  });
}

// Helper: HTML-escape
function esc(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
