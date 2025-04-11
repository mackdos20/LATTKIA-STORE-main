import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'date-fns',
            'lucide-react',
            'bcryptjs',
            'jsonwebtoken'
          ],
          'ui': [
            '@/components/ui/button',
            '@/components/ui/card',
            '@/components/ui/dialog',
            '@/components/ui/input',
            '@/components/ui/label',
            '@/components/ui/select',
            '@/components/ui/separator',
            '@/components/ui/sheet',
            '@/components/ui/table',
            '@/components/ui/toast',
            '@/components/layout/MainLayout'
          ],
          'api': [
            '@/lib/api',
            '@/lib/auth',
            '@/lib/db/models'
          ],
          'stores': [
            '@/lib/stores/auth-store',
            '@/lib/stores/cart-store'
          ]
        }
      },
      external: [
        'crypto',
        'fs',
        'stream',
        'zlib',
        'util',
        'buffer',
      ],
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'date-fns',
      'lucide-react'
    ]
  }
});
