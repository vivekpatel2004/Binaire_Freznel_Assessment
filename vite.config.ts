import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: false,
        type: "module",
      },

      manifest: {
        name: "CineScope",
        short_name: "CineScope",
        description: "Discover popular movies with CineScope",
        theme_color: "#111827",
        background_color: "#111827",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [],
      },

      workbox: {
        navigateFallback: "/index.html",

        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,woff2}",
        ],

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/t\/p\//,
            handler: "CacheFirst",
            options: {
              cacheName: "tmdb-images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
    }),
  ],

  server: {
    port: 5173,
    strictPort: true,
  },

  preview: {
    port: 4173,
    strictPort: true,
  },
});