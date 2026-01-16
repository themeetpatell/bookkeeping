import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AccountingLanding from './pages/AccountingLanding';
import BookkeepingLanding from './pages/BookkeepingLanding';
import AccountingSoftwareLanding from './pages/AccountingSoftwareLanding';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AccountingLanding />} />
        <Route path="/accounting" element={<AccountingLanding />} />
        <Route path="/bookkeeping" element={<BookkeepingLanding />} />
        <Route path="/accounting-software" element={<AccountingSoftwareLanding />} />
      </Routes>
    </Layout>
  );
}

export default App;
