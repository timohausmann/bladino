import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { registerExpiredSessionRedirect } from './lib/expiredSession';
import { queryClient } from './lib/queryClient';
import { router } from './router';
import './tailwind.css';

// requestGraphQL must react to expired tokens, but importing router there would
// create a cycle (client → router → auth → client). Register navigation here
// once at boot so expiredSession can redirect without knowing about the router.
registerExpiredSessionRedirect(() => {
  const returnTo = window.location.pathname + window.location.search;
  void router.navigate({
    to: '/login',
    search: { returnTo },
    replace: true,
  });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} context={{ queryClient }} />
  </StrictMode>,
);
