/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import PreprocessorDirectives from 'unplugin-preprocessor-directives/vite'

export default defineConfig({
  plugins: [
    PreprocessorDirectives({ /* options */ }), // Should be the first plugin
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
    // Aktiviert globale Test-Funktionen (describe, it, expect), 
    // sodass du sie nicht in jeder Datei extra importieren musst.
    // globals: true,
    // Da wir hier reine Logik-Utils testen, reicht die Node-Umgebung völlig aus
    // environment: 'node',
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 
        'html', 
        // 'lcov'
      ],
      // all: true, // Erzwingt, dass auch ungetestete Dateien im Report auftauchen
      reportsDirectory: './docs/html/coverage',
    },
    reporters: [
      "default",
      ["html", { outputDir: "./docs/html" }] 
    ],
  },
});