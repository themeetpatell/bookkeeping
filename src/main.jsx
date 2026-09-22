import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import posthog from 'posthog-js';
import { PostHogProvider, PostHogErrorBoundary } from '@posthog/react';
import './index.css';
import App from './App.jsx';
import { POSTHOG_KEY, posthogOptions } from './lib/posthog';
import { recordEntryTouch } from './utils/leadAttribution';
import { installWhatsAppRef } from './utils/whatsappRef';

posthog.init(POSTHOG_KEY, posthogOptions);

// Expose the initialized instance so non-React scripts — specifically the
// delegated Zoho form-submit handler in index.html — can capture the lead
// conversion on the very same client instance.
if (typeof window !== 'undefined') {
  window.posthog = posthog;
  // Before any route renders, so the session's true entry page and referrer are kept.
  recordEntryTouch();
  // Invisible ref on WhatsApp clicks, joined back to the lead by the Gallabox webhook.
  installWhatsAppRef();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary
        fallback={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Something went wrong. Please refresh the page.
          </div>
        }
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
);
