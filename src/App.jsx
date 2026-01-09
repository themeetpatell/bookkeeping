import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import FinanshelsLanding from './pages/FinanshelsLanding';
import NewHomePage from './pages/NewHomePage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FinanshelsLanding />} />
        <Route path="/v2" element={<NewHomePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
