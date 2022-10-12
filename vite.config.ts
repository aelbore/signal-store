import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    include: [ 'src/**/*.test.ts' ],
    environment: 'happy-dom',
    css: true,
    reporters: [ 'verbose' ],
    coverage: {
      cleanOnRerun: true,
      reporter: [ 'text', 'html' ]
    }
  }
})