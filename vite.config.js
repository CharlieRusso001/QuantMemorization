import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Link previews (iMessage/SMS, Snapchat, Discord, etc.) need an absolute image URL.
// On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set automatically at build time.
// Set SITE_URL yourself to override it (e.g. when you add a custom domain).
function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'http://localhost:5173';
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-site-url',
      transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl()),
    },
  ],
});
