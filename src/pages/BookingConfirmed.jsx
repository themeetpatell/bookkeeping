import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
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

const BookingConfirmed = () => {
  const posthog = usePostHog();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window === 'undefined') return;
    if (hasAlreadyFired()) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'zoho_booking_completed',
      _event: 'zoho_booking_completed'
    });
    posthog?.capture('zoho_booking_completed');
    markAsFired();
  }, [posthog]);

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <div className="thank-you-content">
          <div className="success-icon">
            <FiCheckCircle />
          </div>

          <h1 className="thank-you-title">Your Call Is Booked!</h1>

          <p className="thank-you-message">
            Your consultation is confirmed. A calendar invite and meeting link are on
            their way to your inbox — please check spam if you don't see it shortly.
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
            <a href="mailto:contact@finanshels.com" className="email-link">contact@finanshels.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmed;
