import './App.css';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import AccountingLanding from './pages/AccountingLanding';
import AccountingLandingBing from './pages/AccountingLandingBing';
import BookkeepingLanding from './pages/BookkeepingLanding';
import BookkeepingLandingBing from './pages/BookkeepingLandingBing';
import AccountingSoftwareLanding from './pages/AccountingSoftwareLanding';
import AccountingSoftwareLandingBing from './pages/AccountingSoftwareLandingBing';
import PayrollAccountingLanding from './pages/PayrollAccountingLanding';
import PayrollAccountingLandingBing from './pages/PayrollAccountingLandingBing';
import AccountingWhatsApp from './pages/AccountingWhatsApp';
import AIAccountingLanding from './pages/AIAccountingLanding';
import AccountingForm from './pages/AccountingForm';
import ThankYou from './pages/ThankYou';
import BookingConfirmed from './pages/BookingConfirmed';

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
    <Layout>
      <Routes>
        <Route path="/" element={<AccountingLanding />} />
        <Route path="/accounting-bing" element={<AccountingLandingBing />} />
        <Route path="/bookkeeping" element={<BookkeepingLanding />} />
        <Route path="/bookkeeping-bing" element={<BookkeepingLandingBing />} />
        <Route path="/accounting-software" element={<AccountingSoftwareLanding />} />
        <Route path="/accounting-software-bing" element={<AccountingSoftwareLandingBing />} />
        <Route path="/payroll-accounting" element={<PayrollAccountingLanding />} />
        <Route path="/payroll-accounting-bing" element={<PayrollAccountingLandingBing />} />
        <Route path="/accounting-whatsapp" element={<AccountingWhatsApp />} />
        <Route path="/ai-accounting" element={<AIAccountingLanding />} />
        <Route path="/accounting-form" element={<AccountingForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/thank-you-from-finanshels" element={<ThankYou />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
      </Routes>
    </Layout>
  );
}

export default App;
