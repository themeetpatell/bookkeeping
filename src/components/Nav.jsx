import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import finanshelsLogo from '../assets/finanshelslogo.svg';
import { getBookingPath } from '../utils/booking';

// `minimal` collapses the nav for paid-traffic routes: the section links are
// dropped so the first screen offers one decision, and the bar itself shrinks.
// See src/utils/chrome.js for which routes opt in.
const Nav = ({ minimal = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const posthog = usePostHog();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`nav-modern ${isScrolled ? 'nav-scrolled' : ''} ${minimal ? 'nav-minimal' : ''}`}
    >
      <div className="nav-container-modern">
        <a href="/" className="nav-logo-modern">
          <img src={finanshelsLogo} alt="Finanshels" className="nav-logo-img" />
        </a>
        
        {!minimal && (
          <nav className="nav-links">
            <button onClick={() => scrollToSection('services')} className="nav-link">Services</button>
            <button onClick={() => scrollToSection('pricing')} className="nav-link">Pricing</button>
            <button onClick={() => scrollToSection('testimonials')} className="nav-link">Testimonials</button>
            <button onClick={() => scrollToSection('faq')} className="nav-link">FAQ</button>
          </nav>
        )}
        
        {/* The nav CTA is a second offer. On focused routes the page's own
            primary CTA is the only decision, so this is dropped entirely. */}
        {!minimal && (
          <Link
            to={getBookingPath(pathname)}
            className="btn-nav-primary"
            onClick={() => posthog?.capture('book_call_clicked', { location: 'nav' })}
          >
            Book a Free Call
          </Link>
        )}
      </div>
    </header>
  );
};

export default Nav;
