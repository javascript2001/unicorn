/**
 * Register page — multi-step form
 * Step 1: Basic info (name, email, username, password, dob)
 * Step 2: Developer info (skills, experience, mood, links)
 */
import { api }      from '../utils/api.js';
import { toast }    from '../utils/toast.js';
import { navigate } from '../app.js';

const STEPS = 2;
let currentStep = 1;
let formData = {};
let skillsList = [];

export function renderRegister() {
  currentStep = 1;
  formData = {};
  skillsList = [];

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page" style="padding:var(--sp-8) var(--sp-6)">
      <div class="auth-bg-glow g1"></div>
      <div class="auth-bg-glow g2"></div>

      <div class="auth-card auth-card-wide">
        <div class="auth-logo">
          <div class="auth-logo-icon">🦄</div>
          <span class="auth-logo-name">Unicorn</span>
        </div>

        <!-- Step indicator -->
        <div class="step-indicator" id="step-indicator">
          <div class="step-dot active" id="dot-1"></div>
          <div class="step-line"></div>
          <div class="step-dot" id="dot-2"></div>
        </div>

        <div id="step-title">
          <h1 class="auth-title">Create your account</h1>
          <p class="auth-subtitle">Step 1 of 2 — Basic information</p>
        </div>

        <!-- Step 1 -->
        <form id="step1-form" class="auth-form" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="reg-first">First name <span class="required">*</span></label>
              <input class="form-input" type="text" id="reg-first" placeholder="John" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-last">Last name <span class="required">*</span></label>
              <input class="form-input" type="text" id="reg-last" placeholder="Doe" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-username">Username <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-icon left" style="font-size:.85rem;color:var(--clr-subtle)">@</span>
              <input class="form-input input-icon-left" type="text" id="reg-username" placeholder="johndoe" required autocomplete="username" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-email">Email <span class="required">*</span></label>
            <input class="form-input" type="email" id="reg-email" placeholder="john@example.com" required autocomplete="email" />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-dob">Date of birth <span class="required">*</span></label>
            <input class="form-input" type="date" id="reg-dob" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-mobile">Mobile <span style="color:var(--clr-subtle);font-weight:400">(optional)</span></label>
            <input class="form-input" type="tel" id="reg-mobile" placeholder="+91 98765 43210" />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-password">Password <span class="required">*</span></label>
            <div class="input-wrap">
              <input class="form-input input-icon-right" type="password" id="reg-password" placeholder="Min 8 characters" required autocomplete="new-password" />
              <span class="input-icon right" id="reg-toggle-pw" title="Show/hide">👁</span>
            </div>
          </div>

          <div id="step1-error" class="form-error hidden"></div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" id="step1-btn">
            Continue →
          </button>
        </form>

        <!-- Step 2 (hidden initially) -->
        <form id="step2-form" class="auth-form hidden" novalidate>
          <div class="form-group">
            <label class="form-label">Skills <span class="required">*</span></label>
            <div class="tag-input-wrap" id="skills-wrap">
              <input
                class="tag-text-input"
                id="skills-input"
                placeholder="Type a skill and press Enter (e.g. React, Node.js)"
              />
            </div>
            <span class="form-hint">Press Enter or comma to add a skill</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-experience">Experience level <span class="required">*</span></label>
            <select class="form-input form-select" id="reg-experience" required>
              <option value="" disabled selected>Select your level</option>
              <option value="JUNIOR">Junior (&lt; 2 years)</option>
              <option value="MID_LEVEL">Mid-Level (2–5 years)</option>
              <option value="SENIOR">Senior (5–9 years)</option>
              <option value="EXPERT">Expert (10+ years)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-mood">Availability <span class="required">*</span></label>
            <select class="form-input form-select" id="reg-mood" required>
              <option value="" disabled selected>What are you looking for?</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="FREELANCE">Freelance / Contract</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-linkedin">LinkedIn URL <span class="required">*</span></label>
            <input class="form-input" type="url" id="reg-linkedin" placeholder="https://linkedin.com/in/username" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-github">GitHub URL <span class="required">*</span></label>
            <input class="form-input" type="url" id="reg-github" placeholder="https://github.com/username" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-portfolio">Portfolio URL <span style="color:var(--clr-subtle);font-weight:400">(optional)</span></label>
            <input class="form-input" type="url" id="reg-portfolio" placeholder="https://yoursite.com" />
          </div>

          <div id="step2-error" class="form-error hidden"></div>

          <div style="display:flex;gap:var(--sp-3)">
            <button type="button" class="btn btn-ghost btn-lg" id="step2-back" style="flex:1">
              ← Back
            </button>
            <button type="submit" class="btn btn-primary btn-lg" id="step2-btn" style="flex:2">
              Create account
            </button>
          </div>
        </form>

        <div class="auth-footer">
          Already have an account? <span class="auth-link" id="go-login">Sign in</span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('go-login').addEventListener('click', () => navigate('/login'));

  // Toggle password
  const pwInput = document.getElementById('reg-password');
  document.getElementById('reg-toggle-pw').addEventListener('click', () => {
    pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  });

  // Skills tag input
  initSkillsInput();

  // Step 1 submit
  document.getElementById('step1-form').addEventListener('submit', handleStep1);

  // Step 2 back
  document.getElementById('step2-back').addEventListener('click', () => goToStep(1));

  // Step 2 submit
  document.getElementById('step2-form').addEventListener('submit', handleStep2);
}

function initSkillsInput() {
  const input = document.getElementById('skills-input');
  const wrap  = document.getElementById('skills-wrap');

  function addSkill(value) {
    const skill = value.trim().replace(/,+$/, '').trim();
    if (!skill || skillsList.includes(skill)) return;
    skillsList.push(skill);

    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `${skill}<span class="tag-remove" data-skill="${skill}">×</span>`;
    wrap.insertBefore(tag, input);

    tag.querySelector('.tag-remove').addEventListener('click', () => {
      skillsList = skillsList.filter(s => s !== skill);
      tag.remove();
    });

    input.value = '';
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input.value);
    } else if (e.key === 'Backspace' && !input.value && skillsList.length) {
      const last = skillsList[skillsList.length - 1];
      skillsList.pop();
      wrap.querySelector(`.tag-remove[data-skill="${last}"]`)?.closest('.tag')?.remove();
    }
  });

  input.addEventListener('blur', () => { if (input.value.trim()) addSkill(input.value); });
  wrap.addEventListener('click', () => input.focus());
}

function goToStep(step) {
  currentStep = step;

  const form1  = document.getElementById('step1-form');
  const form2  = document.getElementById('step2-form');
  const dot1   = document.getElementById('dot-1');
  const dot2   = document.getElementById('dot-2');
  const title  = document.getElementById('step-title');

  if (step === 1) {
    form1.classList.remove('hidden');
    form2.classList.add('hidden');
    dot1.className = 'step-dot active';
    dot2.className = 'step-dot';
    title.innerHTML = '<h1 class="auth-title">Create your account</h1><p class="auth-subtitle">Step 1 of 2 — Basic information</p>';
  } else {
    form1.classList.add('hidden');
    form2.classList.remove('hidden');
    dot1.className = 'step-dot done';
    dot2.className = 'step-dot active';
    title.innerHTML = '<h1 class="auth-title">Developer profile</h1><p class="auth-subtitle">Step 2 of 2 — Your skills & availability</p>';
  }
}

function handleStep1(e) {
  e.preventDefault();
  const err = document.getElementById('step1-error');
  err.classList.add('hidden');

  const firstName = document.getElementById('reg-first').value.trim();
  const lastName  = document.getElementById('reg-last').value.trim();
  const username  = document.getElementById('reg-username').value.trim();
  const mail      = document.getElementById('reg-email').value.trim();
  const dob       = document.getElementById('reg-dob').value.trim();
  const mobile    = document.getElementById('reg-mobile').value.trim();
  const password  = document.getElementById('reg-password').value;

  if (!firstName || !lastName || !username || !mail || !dob || !password) {
    err.textContent = 'Please fill in all required fields.';
    err.classList.remove('hidden');
    return;
  }
  if (password.length < 6) {
    err.textContent = 'Password must be at least 6 characters.';
    err.classList.remove('hidden');
    return;
  }

  formData = { firstName, lastName, username, mail, dob, password, ...(mobile ? { mobile } : {}) };
  goToStep(2);
}

async function handleStep2(e) {
  e.preventDefault();
  const err = document.getElementById('step2-error');
  err.classList.add('hidden');

  const experience = document.getElementById('reg-experience').value;
  const mood       = document.getElementById('reg-mood').value;
  const linkedIn   = document.getElementById('reg-linkedin').value.trim();
  const github     = document.getElementById('reg-github').value.trim();
  const portfolio  = document.getElementById('reg-portfolio').value.trim();

  if (!experience || !mood || !linkedIn || !github) {
    err.textContent = 'Please fill in all required fields.';
    err.classList.remove('hidden');
    return;
  }
  if (skillsList.length === 0) {
    err.textContent = 'Please add at least one skill.';
    err.classList.remove('hidden');
    return;
  }

  const body = {
    ...formData,
    experience, mood, linkedIn, github,
    skills: skillsList,
    ...(portfolio ? { portfolio } : {}),
  };

  const btn = document.getElementById('step2-btn');
  btn.classList.add('btn-loading');
  btn.disabled = true;

  try {
    await api.post('/api/v1/auth/register', body);
    toast('success', 'Check your inbox to verify your email.', 'Account created!');
    navigate('/verify-pending', true);
  } catch (ex) {
    err.textContent = ex.message || 'Registration failed. Please try again.';
    err.classList.remove('hidden');
  } finally {
    btn.classList.remove('btn-loading');
    btn.disabled = false;
  }
}
