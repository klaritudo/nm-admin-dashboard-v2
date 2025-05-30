import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
        // Prevent multiple instances of @emotion/react
        babelrc: false,
        configFile: false
      }
    })
  ],
  // Add dedupe for emotion packages
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@mui/icons-material/MoreVert',
      '@mui/icons-material/Person',
      '@mui/icons-material/CheckCircle',
      '@mui/icons-material/PauseCircleOutline',
      '@mui/icons-material/Delete',
      '@emotion/react',
      '@emotion/styled',
      '@emotion/cache'
    ],
    force: true
  },
  // Add special config for dependencies that might be duplicated
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@app': path.resolve(__dirname, './src/app'),
      // Deduplicate emotion packages
      '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
      '@emotion/styled': path.resolve(__dirname, 'node_modules/@emotion/styled')
    },
    dedupe: ['@emotion/react', '@emotion/styled', 'react', 'react-dom']
  },
  base: '/',
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
    open: true,
    cors: true,
    force: true,
    hmr: {
      port: 5173,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    fs: {
      // 정적 파일 접근 허용
      strict: false,
      allow: ['..', '/Applications/MAMP/htdocs/nm']
    }
  },
  // 빌드 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    commonjsOptions: {
      // This helps with bundling and deduplication
      transformMixedEsModules: true
    }
  },
  // 캐시 최적화 설정
  cacheDir: 'node_modules/.vite',
})
