import './App.css';
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import SalesIQAttribution from './components/SalesIQAttribution';
import WhatsAppTracker from './components/WhatsAppTracker';
import LeadEventTracker from './components/LeadEventTracker';

/* Every page is its own chunk. These are paid landing pages: a visitor lands
   on exactly one and almost never navigates to another, so shipping all
   seventeen in a single bundle made each page download sixteen it would
   never render. Layout and the trackers above stay eager because they must
   survive client-side navigation. */
const AccountingLanding = lazy(() => import('./pages/AccountingLanding'));
const AccountingLandingBing = lazy(() => import('./pages/AccountingLandingBing'));
const BookkeepingLanding = lazy(() => import('./pages/BookkeepingLanding'));
const BookkeepingLandingBing = lazy(() => import('./pages/BookkeepingLandingBing'));
const PackagesLanding = lazy(() => import('./pages/PackagesLanding'));
const BooksCleanupLanding = lazy(() => import('./pages/BooksCleanupLanding'));
const AccountingSoftwareLanding = lazy(() => import('./pages/AccountingSoftwareLanding'));
const AccountingSoftwareLandingBing = lazy(() => import('./pages/AccountingSoftwareLandingBing'));
const PayrollAccountingLanding = lazy(() => import('./pages/PayrollAccountingLanding'));
const PayrollAccountingLandingBing = lazy(() => import('./pages/PayrollAccountingLandingBing'));
const AccountingWhatsApp = lazy(() => import('./pages/AccountingWhatsApp'));
const AIAccountingLanding = lazy(() => import('./pages/AIAccountingLanding'));
const AccountingForm = lazy(() => import('./pages/AccountingForm'));
const AccountingFormReddit = lazy(() => import('./pages/AccountingFormReddit'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const BookingConfirmed = lazy(() => import('./pages/BookingConfirmed'));
const BookACall = lazy(() => import('./pages/BookACall'));

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
      <LeadEventTracker />

      <Suspense fallback={null}>
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
          {/* The only thank-you route. `/thank-you-from-finanshels` was a second
              copy of this same page; it is now a 308 to here in vercel.json, so any
              old link still lands on the page that fires the conversion. */}
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        </Route>
      </Routes>
      </Suspense>
    </>
  );
}

export default App;
