import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AccountingLanding from './pages/AccountingLanding';
import AccountingLandingBing from './pages/AccountingLandingBing';
import BookkeepingLanding from './pages/BookkeepingLanding';
import BookkeepingLandingBing from './pages/BookkeepingLandingBing';
import AccountingSoftwareLanding from './pages/AccountingSoftwareLanding';
import AccountingSoftwareLandingBing from './pages/AccountingSoftwareLandingBing';
import PayrollAccountingLanding from './pages/PayrollAccountingLanding';
import PayrollAccountingLandingBing from './pages/PayrollAccountingLandingBing';
import ThankYou from './pages/ThankYou';

function App() {
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
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/thank-you-from-finanshels" element={<ThankYou />} />
      </Routes>
    </Layout>
  );
}

export default App;
