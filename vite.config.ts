import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const suppressHmrWebSocketPlugin = {
  name: 'suppress-hmr-websocket',
  transformIndexHtml: {
    order: 'pre' as const,
    handler() {
      return [
        {
          tag: 'script',
          attrs: { type: 'text/javascript' },
          children: `if (typeof window !== 'undefined') {
  const OrigWS = window.WebSocket;
  if (OrigWS) {
    window.WebSocket = function(url, protocols) {
      const s = String(url || '');
      if (s.includes('/@vite') || s.includes('ais-dev') || s.includes('run.app') || s.includes('localhost')) {
        const e = new EventTarget();
        e.url = s;
        e.readyState = 1;
        e.send = function() {};
        e.close = function() { e.readyState = 3; };
        return e;
      }
      return new OrigWS(url, protocols);
    };
    window.WebSocket.prototype = OrigWS.prototype;
  }
  const origErr = console.error;
  console.error = function(...args) {
    if (args.some(a => (typeof a === 'string' && (a.includes('[vite]') || a.includes('WebSocket'))) || (a && typeof a === 'object' && a.message && (a.message.includes('[vite]') || a.message.includes('WebSocket'))))) {
      return;
    }
    origErr.apply(console, args);
  };
}`,
          injectTo: 'head-prepend' as const,
        },
      ];
    },
  },
};

export default defineConfig(() => {
  return {
    plugins: [
      suppressHmrWebSocketPlugin,
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg',
          'images/*.jpg',
          'images/*.png',
        ],
        manifest: {
          id: '/',
          name: 'Sahabat Puyuh Hataswa',
          short_name: 'PuyuhHataswa',
          description: 'Sistem Manajemen & Analisis Keuangan Peternakan Burung Puyuh Modern.',
          theme_color: '#022c22',
          background_color: '#022c22',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: false,
    },
  };
});
