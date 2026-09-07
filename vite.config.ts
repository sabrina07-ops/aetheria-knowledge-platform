import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function liveServerSupport(): Plugin {
  return {
    name: 'live-server-support',
    transformIndexHtml(html: string) {
      return html.replace('<!-- VITE_ENTRY -->', '<script type="module" src="/src/main.tsx"></script>');
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [liveServerSupport(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
