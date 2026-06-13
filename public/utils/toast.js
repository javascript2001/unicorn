/**
 * Toast notification system
 */

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

const TITLES = {
  success: 'Success',
  error:   'Error',
  info:    'Info',
};

export function toast(type, message, title) {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `
    <div class="toast-icon">${ICONS[type] || 'ℹ'}</div>
    <div class="toast-body">
      <div class="toast-title">${title || TITLES[type] || 'Notice'}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;
  container.appendChild(t);

  // Auto-dismiss
  setTimeout(() => {
    t.classList.add('leaving');
    setTimeout(() => t.remove(), 300);
  }, 4000);
}
