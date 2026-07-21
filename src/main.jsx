import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import posthog from 'posthog-js';
import { PostHogProvider, PostHogErrorBoundary } from '@posthog/react';
import './index.css';
import App from './App.jsx';
import { POSTHOG_KEY, posthogOptions } from './lib/posthog';

posthog.init(POSTHOG_KEY, posthogOptions);

// Expose the initialized instance so non-React scripts — specifically the
// delegated Zoho form-submit handler in index.html — can capture the lead
// conversion on the very same client instance.
if (typeof window !== 'undefined') {
  window.posthog = posthog;
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
