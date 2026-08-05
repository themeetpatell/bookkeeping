import { useEffect, useState } from 'react';
import { usePostHog } from '@posthog/react';
import finanshelsLogo from '../assets/finanshelslogo.svg';
import { BOOKING_URL } from '../utils/booking';

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const posthog = usePostHog();

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
    <header className={`nav-modern ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container-modern">
        <a href="/" className="nav-logo-modern">
          <img src={finanshelsLogo} alt="Finanshels" className="nav-logo-img" />
        </a>
        
        <nav className="nav-links">
          <button onClick={() => scrollToSection('services')} className="nav-link">Services</button>
          <button onClick={() => scrollToSection('pricing')} className="nav-link">Pricing</button>
          <button onClick={() => scrollToSection('testimonials')} className="nav-link">Testimonials</button>
          <button onClick={() => scrollToSection('faq')} className="nav-link">FAQ</button>
        </nav>
        
        <a
          href={BOOKING_URL}
          className="btn-nav-primary"
          target="_blank"
          rel="noreferrer"
          onClick={() => posthog?.capture('book_call_clicked', { location: 'nav' })}
        >
          Book a Free Call
        </a>
      </div>
    </header>
  );
};

export default Nav;
