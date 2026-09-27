import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CheckPage from './pages/CheckPage';
import ResultPage from './pages/ResultPage';
import AttackChainPage from './pages/AttackChainPage';
import DemoPage from './pages/DemoPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [checkCategory, setCheckCategory] = useState('message');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setActivePage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDemoScenario = (scenarioResult) => {
    setAnalysisResult(scenarioResult);
    setActivePage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setActivePage('check');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setActivePage('check');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main style={{ flex: 1 }} className="container">
        {activePage === 'home' && (
          <HomePage 
            setActivePage={setActivePage} 
            setCheckCategory={setCheckCategory} 
          />
        )}

        {activePage === 'check' && (
          <CheckPage 
            activeCategory={checkCategory}
            setActiveCategory={setCheckCategory}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {activePage === 'result' && (
          <ResultPage 
            result={analysisResult}
            onBack={handleBackToForm}
            onReset={handleReset}
          />
        )}

        {activePage === 'attack-chain' && (
          <AttackChainPage />
        )}

        {activePage === 'demo' && (
          <DemoPage onSelectDemoScenario={handleSelectDemoScenario} />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}
      </main>

      <Footer />
    </div>
  );
}
