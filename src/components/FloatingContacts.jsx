import { FaWhatsapp } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { brand } from '../content/countries';

const FloatingContacts = () => {
  const phoneHref = brand.phone.replace(/\s+/g, '');
  const whatsappUrl = 'https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services+starting+from+$499/mo.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0';

  return (
    <div className="floating-contacts" aria-label="Contact options">
      <a
        className="contact-btn whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        data-wa-track="true"
      >
        <FaWhatsapp className="contact-icon" />
        <span className="contact-label">WhatsApp</span>
      </a>
      <a className="contact-btn phone" href={`tel:${phoneHref}`} aria-label="Call us">
        <FiPhoneCall className="contact-icon" />
        <span className="contact-label">Call us</span>
      </a>
    </div>
  );
};

export default FloatingContacts;
