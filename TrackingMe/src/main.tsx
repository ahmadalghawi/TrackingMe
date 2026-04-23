import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Hero from '@/routes/Hero';
import Tracking from '@/routes/Tracking';
import NotFound from '@/routes/NotFound';
import Pricing from '@/routes/Pricing';
import Couriers from '@/routes/Couriers';
import Solutions from '@/routes/Solutions';
import Contact from '@/routes/Contact';
import './styles/globals.css';

const router = createBrowserRouter([
  { path: '/', element: <Hero /> },
  { path: '/tracking', element: <Tracking /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/couriers', element: <Couriers /> },
  { path: '/solutions', element: <Solutions /> },
  { path: '/contact', element: <Contact /> },
  { path: '*', element: <NotFound /> },
], {
  basename: '/TrackingMe/',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
