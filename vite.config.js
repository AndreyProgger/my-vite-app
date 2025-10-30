import { defineConfig } from 'vite'
import { resolve } from 'path'


const repositoryName = 'my-vite-app'

export default defineConfig({
  base: `/${repositoryName}/`,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        films: resolve(__dirname, 'src/pages/films/films.html'),
        converter: resolve(__dirname, 'src/pages/converter/converter.html'),
        weather: resolve(__dirname, 'src/pages/weather/weather.html'),
      },
    },
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
})