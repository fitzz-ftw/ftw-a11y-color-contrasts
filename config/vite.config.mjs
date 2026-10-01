/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import PreprocessorDirectives from 'unplugin-preprocessor-directives/vite';
import PluginInspect from 'vite-plugin-inspect';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    PreprocessorDirectives({},), // Should be the first plugin
    PluginInspect(),
  ],
  test: {
    include:[
      "src/utils/ColorContrastPair.*.js",
      "src/utils/get-fonts.*.js",
      "src/components/color-controler/*.*.js",
      "src/components/color-card/*.*.js",
      "src/components/components.test.js"
      // "src/debug.test.js",
    ],
    exclude: [
      "docssrc",
      "static",
      "utils",
      "docu",
      "dist",
    ],
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 
        'html', 
        'json-summary', 
        'json'
      ],
      // all: true, // Erzwingt, dass auch ungetestete Dateien im Report auftauchen
      reportsDirectory: './docs/html/coverage',
      reportOnFailure: true,
      // thresholds: {
      //   lines: 80,
      //   branches: 80,
      //   functions: 80,
      //   statements: 80
      // },
    },
    reporters: [
      "default",
      ["html", { outputDir: "./docs/html" }] 
    ],
  }, 
  build: {
    lib: {
      entry: resolve(import.meta.dirname, '../src/index.js'),
      name: 'A11yColorComponents',
      fileName: 'a11y-color-contrasts',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // Verhindert, dass externe/globale Dinge als App-Bundle interpretiert werden
      external: ['culori'],
      output: {
        // Globale Variablen für UMD-Build, falls nötig
        globals: {
          culori: 'culori',
        },
      },
    },
  }
});