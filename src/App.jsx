import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AccountingLanding from './pages/AccountingLanding';
import BookkeepingLanding from './pages/BookkeepingLanding';
import AccountingSoftwareLanding from './pages/AccountingSoftwareLanding';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AccountingLanding />} />
        <Route path="/bookkeeping" element={<BookkeepingLanding />} />
        <Route path="/accounting-software" element={<AccountingSoftwareLanding />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/thank-you-from-finanshels" element={<ThankYou />} />
      </Routes>
    </Layout>
  );
}

export default App;
