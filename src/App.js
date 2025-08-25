import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; 
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Navbar from './components/NavBarSection/Navbar';
import About from './Routes/About';
import Contact from './Routes/Contact';
import Home from './Routes/Home';
import Services from './Routes/Services';
import Signup from './Routes/Signup';
import BudgetManager from './components/BudgetManager/BudgetManager';
import ExperienceForm from './components/ShareYourExperience/ExperienceForm';
import Phrasebook from './components/PhraseBook/Phrasebook';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ['/budget', '/share-experience', '/translate'];

  return (
    <div className="App">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      {/* ✅ Wrap Routes in AnimatePresence for animation support */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/budget" element={<BudgetManager />} />
          <Route path="/share-experience" element={<ExperienceForm />} />
          <Route path="/translate" element={<Phrasebook />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
