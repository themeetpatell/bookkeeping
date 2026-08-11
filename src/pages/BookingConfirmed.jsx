import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import {
  APP_ORIGINS,
  BOOKING_CONFIRMED_MESSAGE,
  readBookedEmail,
} from '../utils/booking';
import './ThankYou.css';

// Landing page for the Zoho Bookings post-booking redirect. Configure the
// "redirect after booking" URL in Zoho Bookings to point here so the Google Ads
// booking conversion fires on a CONFIRMED booking instead of on a link click.
const BOOKING_FIRED_KEY = 'zoho_booking_conversion_fired';

// Zoho opens in a new tab, so a "booking started" flag set on the landing page
// cannot be relied on here. Instead we fire once per tab session, which stops a
// refresh of this page from double-counting the conversion.
const hasAlreadyFired = () => {
  try {
    return window.sessionStorage.getItem(BOOKING_FIRED_KEY) === '1';
  } catch {
    // sessionStorage blocked (private mode) — fire and accept the small
    // refresh-duplication risk rather than losing the conversion entirely.
    return false;
  }
};

const markAsFired = () => {
  try {
    window.sessionStorage.setItem(BOOKING_FIRED_KEY, '1');
  } catch {
    // Ignore write failures; firing once is the priority.
  }
};

/* How long to wait for a cross-origin parent to navigate itself after being
   asked to. If it has not by then the frame is on its own — most likely nobody
   is listening — so it fires in place: one conversion in an awkward context
   beats none at all. */
const PARENT_HANDOVER_TIMEOUT_MS = 2000;

/**
 * Asks whichever of our pages is framing this one to take over the navigation.
 * No wildcard target: postMessage only delivers when the origin matches, so
 * listing them keeps the customer's email away from any other framing site.
 * @param {string} email - the booked email, for enhanced conversions
 */
const askParentToTakeOver = (email) => {
  APP_ORIGINS.forEach((origin) => {
    try {
      window.parent.postMessage({ type: BOOKING_CONFIRMED_MESSAGE, email }, origin);
    } catch {
      // A refused target origin is expected — only one of them can match.
    }
  });
};

/**
 * The scheduler runs in an iframe on /book-a-call, so Zoho's post-booking
 * redirect lands this page INSIDE that frame — squeezed into the widget box,
 * with the conversion firing in a nested context. Get out to the top window so
 * the confirmation renders full page and the tags fire where GTM expects.
 *
 * Same-origin is a direct navigation. Cross-origin cannot touch the top window
 * at all, so the parent is asked to navigate itself; that tears down this frame
 * before the caller's timeout elapses.
 *
 * @param {string} email - the booked email, forwarded to a cross-origin parent
 * @returns {boolean} true when a handover is in flight and firing should wait
 */
const startBreakoutOfBookingFrame = (email) => {
  if (window.top === window.self) return false;
  try {
    window.top.location.replace(window.location.href);
    return true;
  } catch {
    // Cross-origin parent: the top window is off limits from here.
    askParentToTakeOver(email);
    return true;
  }
};

const BookingConfirmed = () => {
  const posthog = usePostHog();
  // Read once on mount so the confirmed email is in the first paint rather than
  // swapping in after a flash of the generic copy.
  const [customerEmail] = useState(readBookedEmail);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const fireConversion = () => {
      window.scrollTo(0, 0);
      if (hasAlreadyFired()) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'zoho_booking_completed',
        _event: 'zoho_booking_completed'
      });
      posthog?.capture('zoho_booking_completed');
      markAsFired();
    };

    // Must resolve before the conversion push so it fires once, at top level.
    if (!startBreakoutOfBookingFrame(customerEmail)) {
      fireConversion();
      return undefined;
    }

    // A handover is under way. It normally destroys this frame; if it has not
    // by the deadline, nobody took over and firing here is better than losing
    // the booking entirely.
    const timerId = window.setTimeout(fireConversion, PARENT_HANDOVER_TIMEOUT_MS);
    return () => window.clearTimeout(timerId);
  }, [posthog, customerEmail]);

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <div className="thank-you-content">
          <div className="success-icon">
            <FiCheckCircle />
          </div>

          <h1 className="thank-you-title">Your Call Is Booked!</h1>

          <p className="thank-you-message">
            {customerEmail ? (
              <>
                Your consultation is confirmed. A calendar invite and meeting link are
                on their way to <strong>{customerEmail}</strong> — please check spam if
                you don't see it shortly.
              </>
            ) : (
              "Your consultation is confirmed. A calendar invite and meeting link are on their way to your inbox — please check spam if you don't see it shortly."
            )}
          </p>

          <div className="next-steps">
            <h2 className="next-steps-title">What Happens Next?</h2>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Confirmation</h3>
                  <p>Check your email for the invite and meeting link</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Prep</h3>
                  <p>Have your latest books or bank statements handy</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Your Call</h3>
                  <p>We'll walk through your numbers and next steps</p>
                </div>
              </div>
            </div>
          </div>

          <div className="thank-you-actions">
            <Link to="/" className="btn-home">
              <FiArrowLeft />
              Back to Home
            </Link>
          </div>

          <div className="contact-info">
            <p>Need to reschedule or have a question?</p>
            <a href="tel:+971521549572" className="phone-link">+971 52 154 9572</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmed;
