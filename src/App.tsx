import './styles/main.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import LenisProvider from './providers/LenisProvider';
import LanguageRedirect from './components/LanguageRedirect';
import LanguageLayout from './components/LanguageLayout';
import Home from './pages/Home';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LanguageRedirect />} />
      <Route path="/:lang" element={<LanguageLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <LenisProvider options={{ duration: 1.2, smoothWheel: true, wheelMultiplier: 0.8 }}>
            <AppRoutes />
          </LenisProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
