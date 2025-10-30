import { defineConfig } from 'vite'
import { resolve } from 'path'

const repositoryName = 'my-vite-app'

export default defineConfig({
  base: `/${repositoryName}/`,
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        films: resolve(__dirname, 'src/pages/films/films.html'),
        converter: resolve(__dirname, 'src/pages/converter/converter.html'),
        weather: resolve(__dirname, 'src/pages/weather/weather.html'),
      },
      output: {
        // Все HTML файлы в корень dist
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    outDir: 'dist',
  },
})
