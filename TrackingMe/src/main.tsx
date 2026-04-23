import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Hero from '@/routes/Hero';
import Tracking from '@/routes/Tracking';
import NotFound from '@/routes/NotFound';
import './styles/globals.css';

const router = createBrowserRouter([
  { path: '/', element: <Hero /> },
  { path: '/tracking', element: <Tracking /> },
  { path: '*', element: <NotFound /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
