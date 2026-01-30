import { FiMail } from 'react-icons/fi';
import finanshelsLogo from '../assets/finanshelslogo.svg';

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
            <p className="footer-tagline">Fractional CFO support, fundraising prep, and investor-grade reporting.</p>
            <a href="mailto:contact@finanshels.com" className="footer-email">
              <FiMail className="footer-email-icon" />
              <span>contact@finanshels.com</span>
            </a>
          </div>

          <div className="footer-links-section">
            <div className="footer-column">
              <h4 className="footer-heading">Services</h4>
              <a href="#services" onClick={(e) => {e.preventDefault(); scrollToSection('services');}} className="footer-link">Services</a>
              <a href="#testimonials" onClick={(e) => {e.preventDefault(); scrollToSection('testimonials');}} className="footer-link">Reviews</a>
              <a href="#consultation" onClick={(e) => {e.preventDefault(); scrollToSection('consultation');}} className="footer-link">Book a Call</a>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <a href="mailto:contact@finanshels.com" className="footer-link">Contact Us</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-modern">
          <div className="footer-bottom-content">
            <p className="footer-copyright">© {new Date().getFullYear()} Finanshels. Built for modern finance teams.</p>
            <p className="footer-subtext">Financial operations without the busywork.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
