import { FaWhatsapp } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import { brand } from '../content/countries';
import { buildWhatsAppUrl, getAdKeyword, getAdSource } from '../utils/whatsapp';

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

  if (HIDDEN_ON_PATHS.includes(pathname)) {
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

  const trackWhatsAppClick = () => {
    posthog?.capture('whatsapp_click', { source: 'floating_contacts', page_path: pathname, keyword });
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'whatsapp_click', source: 'floating_contacts' });
    }
  };

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
        onClick={trackWhatsAppClick}
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
