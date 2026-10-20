import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { scrapeKohaOpac } from './api/opac-search.js';

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'koha-opac-proxy-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/opac-search')) {
            const urlObj = new URL(req.url, 'http://localhost');
            const q = urlObj.searchParams.get('q') || '';
            const idx = urlObj.searchParams.get('idx') || urlObj.searchParams.get('index') || 'catalog';
            const limit = parseInt(urlObj.searchParams.get('limit') || '25', 10);

            try {
              const data = await scrapeKohaOpac(q, idx, limit);
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify(data));
            } catch (err) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message, books: [] }));
            }
            return;
          }
          next();
        });
      }
    }
  ],
});
