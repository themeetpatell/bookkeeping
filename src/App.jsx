import './App.css';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import SalesIQAttribution from './components/SalesIQAttribution';
import WhatsAppTracker from './components/WhatsAppTracker';
import AccountingLanding from './pages/AccountingLanding';
import AccountingLandingBing from './pages/AccountingLandingBing';
import BookkeepingLanding from './pages/BookkeepingLanding';
import BookkeepingLandingBing from './pages/BookkeepingLandingBing';
import PackagesLanding from './pages/PackagesLanding';
import BooksCleanupLanding from './pages/BooksCleanupLanding';
import AccountingSoftwareLanding from './pages/AccountingSoftwareLanding';
import AccountingSoftwareLandingBing from './pages/AccountingSoftwareLandingBing';
import PayrollAccountingLanding from './pages/PayrollAccountingLanding';
import PayrollAccountingLandingBing from './pages/PayrollAccountingLandingBing';
import AccountingWhatsApp from './pages/AccountingWhatsApp';
import AIAccountingLanding from './pages/AIAccountingLanding';
import AccountingForm from './pages/AccountingForm';
import AccountingFormReddit from './pages/AccountingFormReddit';
import ThankYou from './pages/ThankYou';
import BookingConfirmed from './pages/BookingConfirmed';
import BookACall from './pages/BookACall';

function App() {
  const { pathname } = useLocation();

  // Fire a Reddit Pixel PageVisit on each client-side route change.
  // The base pixel in index.html only fires PageVisit on the initial hard load.
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.rdt === 'function') {
      window.rdt('track', 'PageVisit');
    }
  }, [pathname]);

  return (
    <>
      {/* Mounted once, outside the routes: attribution capture, the WhatsApp
          ref tagger and the SalesIQ widget + CRM bridge must survive client-side
          navigation, so they are deliberately not tied to any single route. */}
      <SalesIQAttribution />
      <WhatsAppTracker />

      <Routes>
        {/* Standalone: the booking page renders the scheduler on its own, with no
            nav, offer bar or floating buttons to distract from or overlap it. */}
        <Route path="/book-a-call" element={<BookACall />} />

        <Route element={<Layout />}>
          <Route path="/" element={<AccountingLanding />} />
          <Route path="/accounting-bing" element={<AccountingLandingBing />} />
          <Route path="/bookkeeping" element={<BookkeepingLanding />} />
          <Route path="/bookkeeping-bing" element={<BookkeepingLandingBing />} />
          {/* Ad-group-specific variant for "bookkeeping packages" — leads with
              the three published tiers instead of the service story. The
              `-bing` twin serves the same component: it posts to the Bing Zoho
              form and, because its path ends in `-bing`, the nav and footer
              booking CTAs resolve to the Bing scheduler (src/utils/booking.js). */}
          <Route path="/packages" element={<PackagesLanding />} />
          <Route path="/packages-bing" element={<PackagesLanding channel="bing" />} />
          {/* Catch-up bookkeeping ad group — one priced engagement rather than
              monthly tiers. Same Google/Bing twin arrangement as /packages. */}
          <Route path="/books-cleanup" element={<BooksCleanupLanding />} />
          <Route
            path="/books-cleanup-bing"
            element={<BooksCleanupLanding channel="bing" />}
          />
          <Route path="/accounting-software" element={<AccountingSoftwareLanding />} />
          <Route path="/accounting-software-bing" element={<AccountingSoftwareLandingBing />} />
          <Route path="/payroll-accounting" element={<PayrollAccountingLanding />} />
          <Route path="/payroll-accounting-bing" element={<PayrollAccountingLandingBing />} />
          <Route path="/accounting-whatsapp" element={<AccountingWhatsApp />} />
          <Route path="/ai-accounting" element={<AIAccountingLanding />} />
          <Route path="/accounting-form" element={<AccountingForm />} />
          <Route path="/accounting-form-reddit" element={<AccountingFormReddit />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/thank-you-from-finanshels" element={<ThankYou />} />
          <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
