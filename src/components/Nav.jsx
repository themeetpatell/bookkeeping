import { useEffect, useState } from 'react';
import finanshelsLogo from '../assets/finanshelslogo.svg';

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`nav-modern ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container-modern">
        <a href="/" className="nav-logo-modern">
          <img src={finanshelsLogo} alt="Finanshels" className="nav-logo-img" />
        </a>
        
        <a
          href="https://contact-finanshels.zohobookings.com/#/accounting-consultation"
          className="btn-nav-primary"
          target="_blank"
          rel="noreferrer"
        >
          Book a Free Call
        </a>
      </div>
    </header>
  );
};

export default Nav;
