import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import { buildWhatsAppUrl, getAdKeyword, isBingRoute } from '../utils/whatsapp';

const OFFER_MESSAGE =
  "Hi, I'd like to claim the 3 months FREE Accounting offer on your Annual Plans.";

// On the accounting-form page the CTA scrolls to the inline lead form
// ("Contact Now") instead of opening WhatsApp.
const FORM_PAGE_PATH = '/accounting-form';
const FORM_ANCHOR_ID = 'hero-form';

const DAYS_IN_WEEK = 7;
const TICK_MS = 1000;

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

// Offer runs every weekend through June 2026; the final weekly countdown
// ends on the last weekend of the month (Sun 28 Jun 2026, 23:59:59 local).
const LAST_WEEKEND_END = new Date(2026, 5, 28, 23, 59, 59, 999);

// End of the current weekend = the upcoming Sunday at 23:59:59 (local time).
// Once a weekend passes, this rolls forward to the next Sunday automatically.
const getWeekendEnd = (now) => {
  const target = new Date(now);
  const daysUntilSunday = (DAYS_IN_WEEK - target.getDay()) % DAYS_IN_WEEK;
  target.setDate(target.getDate() + daysUntilSunday);
  target.setHours(23, 59, 59, 999);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + DAYS_IN_WEEK);
  }

  return target.getTime() > LAST_WEEKEND_END.getTime() ? LAST_WEEKEND_END : target;
};

const getRemaining = (now) => {
  const diff = getWeekendEnd(now).getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / MS_PER_DAY),
    hours: Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE),
    seconds: Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND),
    isExpired: false,
  };
};

const pad = (value) => String(value).padStart(2, '0');

const useWeekendCountdown = () => {
  const [remaining, setRemaining] = useState(() => getRemaining(new Date()));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(new Date())), TICK_MS);
    return () => clearInterval(id);
  }, []);

  return remaining;
};

const OfferBar = () => {
  const { days, hours, minutes, seconds, isExpired } = useWeekendCountdown();
  const { pathname, search } = useLocation();
  const posthog = usePostHog();

  const keyword = getAdKeyword(search);
  const message =
    isBingRoute(pathname) && keyword
      ? `${OFFER_MESSAGE} (I searched for “${keyword}” on Bing.)`
      : OFFER_MESSAGE;
  const whatsappUrl = buildWhatsAppUrl(message);
  const isFormPage = pathname === FORM_PAGE_PATH;

  const handleClick = () => {
    posthog?.capture('whatsapp_click', {
      source: 'offer_bar',
      offer: '3_months_free_annual',
      page_path: pathname,
      keyword,
    });
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'whatsapp_click', source: 'offer_bar' });
    }
  };

  const handleContactClick = (event) => {
    event.preventDefault();
    posthog?.capture('offer_contact_click', {
      source: 'offer_bar',
      offer: '3_months_free_annual',
      page_path: pathname,
    });
    const formEl =
      typeof document !== 'undefined' ? document.getElementById(FORM_ANCHOR_ID) : null;
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="offer-bar" role="region" aria-label="Limited time offer">
      <div className="offer-bar-inner">
        <div className="offer-bar-message">
          <span className="offer-bar-badge">Limited Offer</span>
          <p className="offer-bar-text">
            Get <strong>3 Months FREE Accounting</strong> with Annual Plans &mdash; Switch Easily in <strong>48&nbsp;Hrs</strong>.
          </p>
        </div>

        {!isExpired && (
          <div
            className="offer-bar-countdown"
            role="timer"
            aria-label={`Offer ends in ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`}
          >
            <span className="offer-cd-label">Ends in</span>
            <span className="offer-cd-unit">
              <b>{pad(days)}</b>
              <i>d</i>
            </span>
            <span className="offer-cd-sep">:</span>
            <span className="offer-cd-unit">
              <b>{pad(hours)}</b>
              <i>h</i>
            </span>
            <span className="offer-cd-sep">:</span>
            <span className="offer-cd-unit">
              <b>{pad(minutes)}</b>
              <i>m</i>
            </span>
            <span className="offer-cd-sep">:</span>
            <span className="offer-cd-unit">
              <b>{pad(seconds)}</b>
              <i>s</i>
            </span>
          </div>
        )}

        {isFormPage ? (
          <a
            href={`#${FORM_ANCHOR_ID}`}
            className="offer-bar-cta"
            onClick={handleContactClick}
          >
            <svg className="offer-bar-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 14H5.17L4 17.17V4h16v12Z"
              />
            </svg>
            Contact Now
          </a>
        ) : (
          <a
            href={whatsappUrl}
            className="offer-bar-cta data-wa-track"
            target="_blank"
            rel="noreferrer"
            onClick={handleClick}
          >
            <svg className="offer-bar-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.42 1.31-1.95 1.35-.5.04-.95.22-3.2-.67-2.7-1.06-4.42-3.82-4.56-4-.13-.18-1.1-1.46-1.1-2.78 0-1.33.7-1.98.94-2.25.25-.27.54-.34.72-.34.18 0 .36 0 .52.01.17.01.39-.06.61.47.24.55.81 1.9.88 2.04.07.13.12.29.02.47-.09.18-.14.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.15.27.66 1.09 1.42 1.76.97.87 1.79 1.13 2.05 1.26.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.17-.27.34-.22.57-.13.24.09 1.5.71 1.76.84.26.13.43.2.49.31.07.11.07.63-.17 1.31Z"
              />
            </svg>
            WhatsApp Now
          </a>
        )}
      </div>
    </div>
  );
};

export default OfferBar;
