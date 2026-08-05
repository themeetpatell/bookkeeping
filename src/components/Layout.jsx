import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Nav from './Nav';
import OfferBar from './OfferBar';
import FloatingContacts from './FloatingContacts';

// Layout route for the marketing pages. Routes that opt out of this chrome —
// currently only the booking page — sit outside it in App.jsx.
const Layout = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="app-shell">
      <OfferBar />
      <Nav />
      <main>
        <Outlet />
      </main>
      <FloatingContacts />
      <Footer />
    </div>
  );
};

export default Layout;
