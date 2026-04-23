import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Orders from './pages/Orders';
import { ThemeProvider } from './components/ThemeProvider';
import './i18n';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="trackme-ui-theme">
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
          <footer className="border-t border-border py-6 text-center text-muted-foreground text-sm">
            © 2026 TrackMe. All rights reserved.
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
