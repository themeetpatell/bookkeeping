import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Nav from './Nav';
import OfferBar from './OfferBar';
import TrustBar from './TrustBar';
import FloatingContacts from './FloatingContacts';
import { isFocusedChrome, isQuietChrome } from '../utils/chrome';

// Layout route for the marketing pages. Routes that opt out of this chrome —
// currently only the booking page — sit outside it in App.jsx.
const Layout = () => {
  const { pathname } = useLocation();
  // Paid-traffic pages drop the promotional strips and collapse the nav so the
  // first screen carries a single decision. See src/utils/chrome.js.
  const focused = isFocusedChrome(pathname);
  // Quiet chrome: section nav and offer bar stay, but toned down, and the
  // trust strip and nav CTA are dropped. See src/utils/chrome.js.
  const quiet = isQuietChrome(pathname);

  useEffect(() => {
    /* This used to scroll to the top unconditionally, which silently defeated
       every deep link into the page: the browser honours the hash, then this
       fires on mount and drags the visitor back to the top. Ad final URLs like
       /books-cleanup#software-cleanup depend on the hash winning. */
    const targetId = window.location.hash.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className={
        focused ? 'app-shell app-shell-focused' : quiet ? 'app-shell app-shell-quiet' : 'app-shell'
      }
    >
      {!focused && <OfferBar quiet={quiet} />}
      <Nav minimal={focused} hideCta={quiet} />
      {!focused && !quiet && <TrustBar />}
      <main>
        <Outlet />
      </main>
      <FloatingContacts />
      <Footer />
    </div>
  );
};

export default Layout;
