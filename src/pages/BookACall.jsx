import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import { FiArrowLeft } from 'react-icons/fi';
import finanshelsLogo from '../assets/finanshelslogo.svg';
import Seo from '../components/Seo';
import {
  APP_ORIGINS,
  BOOKING_CONFIRMED_MESSAGE,
  BOOKING_CONFIRMED_PATH,
  resolveBookingUrls,
} from '../utils/booking';
import './BookACall.css';

const EMBED_SCRIPT_SRC = 'https://bookings.nimbuspop.com/assets/embed.js';
const CONTAINER_ID = 'zoho-bookings-container';
const WIDGET_HEIGHT = '720px';
// The widget is third party, so a blocked request can hang forever. Give up
// after this and show the fallback rather than leaving a spinner on screen.
const SCRIPT_TIMEOUT_MS = 12000;

/**
 * Loads the Zoho Bookings embed script on demand and resolves once its global
 * is available. Kept out of index.html so the third-party request only happens
 * for visitors who actually open this page.
 * @returns {Promise<void>}
 */
const loadEmbedScript = () =>
  new Promise((resolve, reject) => {
    if (window.Bookings) {
      resolve();
      return;
    }

    const timeoutId = window.setTimeout(
      () => reject(new Error('Zoho Bookings embed script timed out')),
      SCRIPT_TIMEOUT_MS
    );
    const settle = (fn, value) => {
      window.clearTimeout(timeoutId);
      fn(value);
    };

    // Reuse the tag if a previous visit to this route in the same session
    // already added it, so navigating back here does not refetch the script.
    const existing = document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`);
    const script = existing || document.createElement('script');
    script.addEventListener('load', () => settle(resolve));
    script.addEventListener('error', () =>
      settle(reject, new Error('Zoho Bookings embed script failed to load'))
    );

    if (!existing) {
      script.src = EMBED_SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });

const BookACall = () => {
  const [status, setStatus] = useState('loading');
  const posthog = usePostHog();
  const { search } = useLocation();
  // Which Zoho scheduler to show — the landing page passes its ad channel through
  // on the query string (Google pages omit it and get the Google calendar).
  const { portalUrl, fallbackUrl } = useMemo(() => resolveBookingUrls(search), [search]);
  // The widget is injected imperatively, so it must not run twice — StrictMode
  // invokes effects twice in development.
  const hasEmbedded = useRef(false);

  /* Zoho's post-booking redirect can only name one origin, so on every other
     origin the confirmation page lands here cross-origin and cannot navigate
     us itself. It asks instead; we own the top window, so we go. Without this
     the visitor is left staring at a confirmation crushed into the widget box
     and the booking conversion never fires at page level. */
  useEffect(() => {
    const handleMessage = (event) => {
      if (!APP_ORIGINS.includes(event.origin)) return;
      const { type, email } = event.data || {};
      if (type !== BOOKING_CONFIRMED_MESSAGE) return;

      // Hand the email to our own origin: the confirmation page reads it from
      // here for the enhanced conversion, and it cannot cross origins by itself.
      if (email) {
        try {
          window.sessionStorage.setItem('booking_customer_email', email);
        } catch {
          // Private mode — the conversion still fires, just without the match.
        }
      }

      window.location.replace(BOOKING_CONFIRMED_PATH);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    let isActive = true;

    loadEmbedScript()
      .then(() => {
        if (!isActive || hasEmbedded.current) return;
        hasEmbedded.current = true;
        window.Bookings.inlineEmbed({
          url: portalUrl,
          parent: `#${CONTAINER_ID}`,
          height: WIDGET_HEIGHT,
        });
        setStatus('ready');
      })
      .catch((error) => {
        if (!isActive) return;
        setStatus('error');
        // A widget that never renders is a silently lost booking, so make it
        // visible in both the console and the product analytics.
        console.error('[book-a-call] booking widget unavailable:', error);
        posthog?.capture('booking_widget_failed', { reason: error.message });
      });

    return () => {
      isActive = false;
    };
  }, [posthog, portalUrl]);

  return (
    <div className="booking-page">
      <Seo
        title="Book a Free Call | Finanshels"
        description="Pick a time that suits you for a free 30-minute call with a Finanshels accounting expert."
        canonicalPath="/book-a-call"
      />

      <header className="booking-header">
        <div className="booking-header-inner">
          <Link to="/" className="booking-logo">
            <img src={finanshelsLogo} alt="Finanshels" />
          </Link>
          <Link to="/" className="booking-back">
            <FiArrowLeft />
            Back
          </Link>
        </div>
      </header>

      <main className="booking-main">
        <h1 className="booking-title">Book your free call</h1>
        <p className="booking-subtitle">
          Pick a slot that suits you. It takes 30 minutes and there is no obligation.
        </p>

        <div className="booking-widget-card">
          {status === 'loading' && (
            <p className="booking-status" role="status">
              Loading available times&hellip;
            </p>
          )}

          {status === 'error' && (
            <div className="booking-status booking-status-error" role="alert">
              <p>
                The calendar could not load — an ad blocker or network issue is most
                likely blocking it.
              </p>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="booking-fallback-link"
              >
                Open the booking page in a new tab
              </a>
              <p className="booking-status-alt">
                Or call us on <a href="tel:+971521549572">+971 52 154 9572</a>.
              </p>
            </div>
          )}

          <div id={CONTAINER_ID} className="booking-widget" />
        </div>
      </main>
    </div>
  );
};

export default BookACall;
