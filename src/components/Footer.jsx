import { FiMail, FiMessageCircle } from 'react-icons/fi';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import finanshelsLogo from '../assets/finanshelslogo.svg';
import { buildWhatsAppUrl } from '../utils/whatsapp';

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/finanshels', Icon: FaLinkedinIn },
  { label: 'Instagram', href: 'https://www.instagram.com/finanshels/', Icon: FaInstagram },
  { label: 'X (Twitter)', href: 'https://twitter.com/finanshels', Icon: FaXTwitter },
  { label: 'Facebook', href: 'https://www.facebook.com/finanshels', Icon: FaFacebookF },
  { label: 'YouTube', href: 'https://www.youtube.com/@finanshelshq', Icon: FaYoutube },
  { label: 'TikTok', href: 'https://www.tiktok.com/@finanshelshq', Icon: FaTiktok },
];

const EXPLORE_LINKS = [
  { label: 'Services', id: 'services' },
  { label: 'Reviews', id: 'testimonials' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Get a Consultation', id: 'consultation' },
];

const WHATSAPP_URL = buildWhatsAppUrl(
  'Hi Finanshels! I have a question about your accounting services.'
);

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="footer-modern">
      <div className="footer-container-modern">
        <div className="footer-grid">
          <div className="footer-brand-modern">
            <div className="footer-logo-row">
              <img src={finanshelsLogo} alt="Finanshels" className="footer-logo" />
            </div>
            <p className="footer-tagline">
              The AI-native accounting firm for UAE businesses. AI agents handle the busywork —
              qualified accountants stand behind every number.
            </p>
            <div className="footer-contact-links">
              <a href="mailto:contact@finanshels.com" className="footer-email">
                <FiMail className="footer-email-icon" />
                <span>contact@finanshels.com</span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-email"
              >
                <FiMessageCircle className="footer-email-icon" />
                <span>WhatsApp: +971 52 154 9572</span>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Explore</h4>
            {EXPLORE_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <a href="mailto:contact@finanshels.com" className="footer-link">
              Contact Us
            </a>
            <a
              href="https://contact-finanshels.zohobookings.com/#/accounting-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Book a Free Call
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
              Chat on WhatsApp
            </a>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="footer-social-grid">
              {SOCIAL_LINKS.map((social) => {
                const SocialIcon = social.Icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label={`Finanshels on ${social.label}`}
                  >
                    <SocialIcon aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="footer-bottom-modern">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Finanshels. Built for modern finance teams.
            </p>
            <p className="footer-subtext">Financial operations without the busywork.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
