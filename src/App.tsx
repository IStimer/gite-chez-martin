import './styles/main.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import LenisProvider from './providers/LenisProvider';
import { ContentProvider } from './providers/ContentProvider';
import LanguageRedirect from './components/LanguageRedirect';
import LanguageLayout from './components/LanguageLayout';
import Home from './pages/Home';
import SecondaryPage from './pages/SecondaryPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LanguageRedirect />} />
      <Route path="/:lang" element={<LanguageLayout />}>
        <Route index element={<Home />} />
        <Route path=":slug" element={<SecondaryPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ContentProvider>
          <Router>
            <LenisProvider options={{ duration: 0.8, smoothWheel: true, wheelMultiplier: 1 }}>
              <AppRoutes />
            </LenisProvider>
          </Router>
        </ContentProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
