import { FaWhatsapp } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import { brand } from '../content/countries';
import { buildWhatsAppUrl, getAdKeyword, getAdSource } from '../utils/whatsapp';
import { isFocusedChrome } from '../utils/chrome';

// Naming the network in the message is how sales tells a paid click from a
// direct visitor, so this button says the same thing the page CTAs around it do.
const MESSAGE_BY_SOURCE = {
  bing: 'Hi I saw your bing ads for Accounting Services. I’d like to know more.',
  reddit: 'Hi I saw your ad on Reddit for Accounting Services. I’d like to know more.',
  google: 'Hi I saw your google ad for Accounting Services. I’d like to know more.',
};

// The accounting-form page has its own inline lead form, so the floating
// WhatsApp/Call widgets are hidden there to keep the layout focused.
const HIDDEN_ON_PATHS = ['/accounting-form'];

const FloatingContacts = () => {
  const { pathname, search } = useLocation();
  const posthog = usePostHog();

  // Focused-chrome routes hide these too: they are fixed at top:50%, which on a
  // 390x844 phone lands exactly on the hero CTA, and they add a third and
  // fourth action to a screen that is meant to carry one.
  if (HIDDEN_ON_PATHS.includes(pathname) || isFocusedChrome(pathname)) {
    return null;
  }

  const phoneHref = brand.phone.replace(/\s+/g, '');
  const adSource = getAdSource(pathname);
  const keyword = getAdKeyword(search);
  // Bing hands us the matched search term; surfacing it beats the generic line.
  const message =
    adSource === 'bing' && keyword
      ? `Hi I saw your bing ads for ${keyword}. I’d like to know more.`
      : MESSAGE_BY_SOURCE[adSource];
  const whatsappUrl = buildWhatsAppUrl(message);

  // whatsapp_click is fired by src/components/LeadEventTracker.jsx, which
  // listens for every WhatsApp CTA on the site from one delegated handler. This
  // component used to push its own copy; with both in place the floating button
  // would have reported two clicks for one, while the offer bar, the footer and
  // the in-page CTAs reported none. Do not re-add a local push here.

  const trackPhoneClick = () => {
    posthog?.capture('phone_click', { source: 'floating_contacts', page_path: pathname });
  };

  return (
    <div className="floating-contacts" aria-label="Contact options">
      <a
        className="contact-btn whatsapp data-wa-track"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        data-wa-location="floating_contacts"
      >
        <FaWhatsapp className="contact-icon" />
        <span className="contact-label">WhatsApp</span>
      </a>
      <a
        className="contact-btn phone"
        href={`tel:${phoneHref}`}
        aria-label="Call us"
        onClick={trackPhoneClick}
      >
        <FiPhoneCall className="contact-icon" />
        <span className="contact-label">Call us</span>
      </a>
    </div>
  );
};

export default FloatingContacts;
