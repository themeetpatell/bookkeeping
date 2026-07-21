import { FaWhatsapp } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import { brand } from '../content/countries';
import { buildWhatsAppUrl, getAdKeyword, isBingRoute } from '../utils/whatsapp';

const DEFAULT_MESSAGE = 'Hi I saw your ad for Accounting Services. I’d like to know more.';

const FloatingContacts = () => {
  const { pathname, search } = useLocation();
  const posthog = usePostHog();
  const phoneHref = brand.phone.replace(/\s+/g, '');
  const keyword = getAdKeyword(search);
  const message =
    isBingRoute(pathname) && keyword
      ? `Hi I saw your bing ads for ${keyword}. I’d like to know more.`
      : DEFAULT_MESSAGE;
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
