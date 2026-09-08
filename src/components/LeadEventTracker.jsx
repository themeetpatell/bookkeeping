import { useEffect } from 'react';
import {
  FORM_START,
  WHATSAPP_CLICK,
  NOT_SELECTED,
  claimOnce,
  getLeadId,
  pushLeadEvent,
  readFormParams,
  stashPendingSubmit,
} from '../utils/leadTracking';

/* The sole owner of `form_start`, the `form_submit` handoff and
   `whatsapp_click`.

   Delegated from `document` rather than wired per component, for the reason
   WhatsAppTracker gives a few files over: this is a SPA, CTAs mount and unmount
   on every route change, and a per-component handler drifts. Four WhatsApp CTAs
   render on a landing page and only one of them used to report a click — the
   floating button — so the number in GA4 was a fraction of reality with nothing
   to say so.

   It also means exactly one handler per event. When FloatingContacts and
   OfferBar each pushed their own `whatsapp_click`, adding a delegated listener
   on top would have double-counted them; those pushes are removed and this
   component is now the only writer. Do not re-add a local one.

   Mounted once in App.jsx, outside the routes, so it survives navigation. */

const ZOHO_ACTION_MARKER = 'formperma';
const WHATSAPP_SELECTOR = '.data-wa-track, a[href*="api.whatsapp.com"], a[href*="wa.me"]';

/** Where the clicked CTA lives, for the `link_location` parameter. Pages set
 *  `data-wa-location`; anything without one still reports a click rather than
 *  being dropped, so a new CTA can never silently go unmeasured. */
const readWhatsAppLocation = (el) => {
  const tagged = el.closest('[data-wa-location]');
  return (tagged && tagged.dataset.waLocation) || 'untagged';
};

/** The Zoho lead form on the page, if any — so a WhatsApp click still reports
 *  whatever the visitor had already answered before switching channel. */
const readPageFormParams = () => {
  const formEl = document.querySelector(`form[action*="${ZOHO_ACTION_MARKER}"]`);
  if (!formEl) {
    return {
      cleanup_type: NOT_SELECTED,
      months_behind: NOT_SELECTED,
      software: NOT_SELECTED,
    };
  }
  const { cleanup_type, months_behind, software } = readFormParams(formEl);
  return { cleanup_type, months_behind, software };
};

const isLeadForm = (formEl) => {
  const action = (formEl && formEl.getAttribute && formEl.getAttribute('action')) || '';
  return action.indexOf(ZOHO_ACTION_MARKER) !== -1;
};

export default function LeadEventTracker() {
  useEffect(() => {
    /* First interaction with a lead form. `focusin` bubbles where `focus` does
       not, and `change` covers a select answered by keyboard or autofill
       without a focus event landing first. Whichever arrives first wins; the
       one-shot key makes the second a no-op. */
    const handleInteraction = (event) => {
      const formEl = event.target && event.target.form;
      if (!isLeadForm(formEl)) return;

      const params = readFormParams(formEl);
      if (!claimOnce(`${FORM_START}:${params.form_name}`)) return;
      pushLeadEvent(FORM_START, params);
    };

    /* Capture phase, because the browser navigates away to Zoho the moment this
       returns — the same reason the conversion handler in index.html is
       registered this way. Nothing is reported as a conversion here: this only
       records what was submitted, and /thank-you fires `form_submit` once Zoho
       has actually accepted the record. */
    const handleSubmit = (event) => {
      const formEl = event.target;
      if (!isLeadForm(formEl)) return;
      stashPendingSubmit(readFormParams(formEl));
    };

    const handleClick = (event) => {
      const link = event.target.closest && event.target.closest(WHATSAPP_SELECTOR);
      if (!link) return;

      const location = readWhatsAppLocation(link);
      if (!claimOnce(`${WHATSAPP_CLICK}:${location}`)) return;

      pushLeadEvent(WHATSAPP_CLICK, {
        form_name: '',
        link_location: location,
        page_path: window.location.pathname,
        keyword: new URLSearchParams(window.location.search).get('utm_term') || '',
        lead_id: getLeadId(),
        ...readPageFormParams(),
      });
    };

    document.addEventListener('focusin', handleInteraction, true);
    document.addEventListener('change', handleInteraction, true);
    document.addEventListener('submit', handleSubmit, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('focusin', handleInteraction, true);
      document.removeEventListener('change', handleInteraction, true);
      document.removeEventListener('submit', handleSubmit, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
