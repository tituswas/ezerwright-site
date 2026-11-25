// This module records a necessary preference only. It loads no tracking service.
(() => {
  'use strict';
  const key = 'ezerwright-cookie-choice-v1';
  // A new optional purpose or provider MUST use a new policy version and ask again.
  const policy = '2026-11-25-no-optional-services';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const panel = document.querySelector('[data-cookie-panel]');
  if (!panel) return;
  const status = panel.querySelector('[data-cookie-status]');
  const settings = [...document.querySelectorAll('[data-cookie-settings]')];
  let opener = null;
  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value?.policy === policy && ['accepted', 'rejected'].includes(value.choice) &&
          Number.isFinite(value.at) && value.at <= Date.now() && value.at > Date.now() - lifetime) return value.choice;
    } catch { /* Missing, corrupt or unavailable storage means optional tracking is off. */ }
    return null;
  }
  function display(choice, focus = false) {
    // An accepted preference never grants permission for an unlisted future service.
    document.documentElement.dataset.optionalTracking = 'off';
    panel.hidden = Boolean(choice);
    if (!choice && focus) panel.querySelector('#cookie-title').focus();
  }
  for (const control of settings) {
    control.hidden = false;
    control.addEventListener('click', event => {
      event.preventDefault();
      opener = control;
      status.textContent = '';
      display(null, true);
    });
  }
  panel.querySelectorAll('[data-cookie-choice]').forEach(button => button.addEventListener('click', () => {
    const choice = button.dataset.cookieChoice;
    if (!['accepted', 'rejected'].includes(choice)) return;
    try {
      localStorage.setItem(key, JSON.stringify({ policy, choice, at: Date.now() }));
      // A failed or silently discarded write must never look like a saved preference.
      if (readChoice() !== choice) throw new Error('Preference unavailable');
      display(choice);
      if (opener?.isConnected) opener.focus();
      else document.querySelector('main')?.focus({ preventScroll: true });
    } catch {
      document.documentElement.dataset.optionalTracking = 'off';
      status.textContent = 'Your browser could not save this choice. Optional tracking remains off. You can continue using the website.';
    }
  }));
  addEventListener('storage', event => {
    if (event.key === key || event.key === null) display(readChoice());
  });
  addEventListener('pageshow', () => display(readChoice()));
  display(readChoice());
})();
