// @ts-check

import { describe, it, expect } from 'vitest';
import {ColorContrastPairs} from './ColorContrastPair.js';

describe('ColorContrastPairs', () => {
  it('should calculate contrast variants correctly for a white background', () => {
    // Arrange & Act: Konstruktor triggert calculate()
    const colorPair = new ColorContrastPairs('#ffffff');

    // Assert: Prüfen, ob die öffentlichen Getter sinnvolle Werte liefern
    expect(colorPair.originalColor).toBe('#ffffff');
    expect(colorPair.ariaLum).toBe(1); // Weiß hat maximale Luminanz

    // Dunklere Kontraste müssen bei einem weißen Hintergrund gefunden werden
    expect(colorPair.darker70).toBeDefined();
    expect(colorPair.darker70Ratio).toBeGreaterThanOrEqual(7.0);
  });
  it('should calculate contrast for a given lightness value', () => {
    const colorPair = new ColorContrastPairs('#ffffff');
    const contrast = colorPair.getContrastForL(0.5);
    expect(contrast).toBeDefined();
    expect(typeof contrast).toBe('number');
    expect(contrast).toBe(3.976653024912438);

  });
});
describe('ColorContrastPairs (BDD - Fachliche Anforderungen)', () => {
  it('should calculate valid darker contrast variants for a light background', () => {
    // Arrange & Act: Ein heller Ausgangspunkt (Weiß)
    const pair = new ColorContrastPairs('#ffffff');

    // Assert: Der Anwender erwartet, dass die berechnigten dunkleren Varianten 
    // die jeweiligen WCAG-Grenzwerte (3.0, 4.5, 7.0) einhalten oder übertreffen.
    /*
     * Picker #000000
     * ColorContrastPair.js:175 Deficiences getter darker 70, IF
     * ColorContrastPair.js:219 Deficiences getter darker 45, IF
     * ColorContrastPair.js:263 Deficiences getter darker 30, IF
     * ColorContrastPair.js:243 Deficiences getter light 45, ELSE
     * ColorContrastPair.js:287 Deficiences getter lighter 30, ELSE
     * ColorContrastPair.js:199 Deficiences getter light 70, ELSE    * 
    */
    expect(pair.darker30Ratio).toBeGreaterThanOrEqual(3.0);
    expect(pair.darker45Ratio).toBeGreaterThanOrEqual(4.5);
    expect(pair.darker70Ratio).toBeGreaterThanOrEqual(7.0);
    expect(pair.lighter30Ratio).toBe(0);
    expect(pair.lighter45Ratio).toBe(0);
    expect(pair.lighter70Ratio).toBe(0);

    expect(pair.darker45Ratio).toBe(4.542224959605253);
    // Es müssen echte Hex-Farben oder valide Werte zurückkommen
    expect(pair.darker70).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('should correctly set and get hue, sat, and lum', () => {
    const pair = new ColorContrastPairs('#808080'); // oder deine entsprechende Klasse

    pair.hue = 180;
    pair.sat = 0.5;
    pair.lum = 0.4;

    expect(pair.hue).toBe(180);
    expect(pair.sat).toBe(0.5);
    expect(pair.lum).toBe(0.4);
  });

  it('should calculate valid lighter contrast variants for a dark background', () => {
    // Arrange & Act: Ein dunkler Ausgangspunkt (Schwarz)
    const pair = new ColorContrastPairs('#000000');

    // Assert: Der Anwender erwartet hellere Kontraststufen, die den Standard erfüllen
    /*
     * HtmlColorControl.js:415 Picker #ffffff
     * ColorContrastPair.js:221 Deficiences getter darker 45, ELSE
     * ColorContrastPair.js:265 Deficiences getter darker 30, ELSE
     * ColorContrastPair.js:177 Deficiences getter darker 70, ELSE
     * ColorContrastPair.js:241 Deficiences getter light 45, IF
     * ColorContrastPair.js:285 Deficiences getter lighter 30, IF
     * ColorContrastPair.js:197 Deficiences getter light 70, IF
    */
    expect(pair.lighter30Ratio).toBeGreaterThanOrEqual(3.0);
    expect(pair.lighter45Ratio).toBeGreaterThanOrEqual(4.5);
    expect(pair.lighter70Ratio).toBeGreaterThanOrEqual(7.0);
    expect(pair.darker30Ratio).toBe(0);
    expect(pair.darker45Ratio).toBe(0);
    expect(pair.darker70Ratio).toBe(0);

    expect(pair.lighter45Ratio).toBe(4.557768319672582);
    expect(pair.lighter70).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('should provide complete color deficiency simulations for accessibility checks', () => {
    // Arrange & Act
    const pair = new ColorContrastPairs('#ffffff'); // Reines Weiß
    const deficiencies = pair.originalColorDef;

    // Assert: Der Anwender erwartet ein Array mit genau 4 Simulationswerten 
    // (Protanopie, Deuteranopie, Tritanopie, Grayscale)
    expect(deficiencies).toHaveLength(4);
    deficiencies.forEach(hexColor => {
      expect(hexColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
    
    /**
     * Test condition for all deficiencies
     *
     * @type {Array<[[string, string, string, string] | never[],number]>}
     */
    const tests =[
      [pair.lighter30Def, 0],
      [pair.lighter45Def, 0],
      [pair.lighter70Def, 0],
      [pair.darker30Def, 4],
      [pair.darker45Def, 4],
      [pair.darker70Def, 4],
    ];
    tests.forEach(item=>{
      const [attr, expected] = item;
      expect(attr).toHaveLength(expected);
      if (expected === 4){
        attr.forEach(hexColor => {
          expect(hexColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
      }
    });
    const pair_b = new ColorContrastPairs('#000000'); // Reines Schwarz
    /**
     * Test condition for all deficiencies
     *
     * @type {Array<[[string, string, string, string] | never[],number]>}
     */
    const tests_b = [
      [pair_b.lighter30Def, 4],
      [pair_b.lighter45Def, 4],
      [pair_b.lighter70Def, 4],
      [pair_b.darker30Def, 0],
      [pair_b.darker45Def, 0],
      [pair_b.darker70Def, 0],
    ];
    tests_b.forEach(item => {
      const [attr, expected] = item;
      expect(attr).toHaveLength(expected);
      if (expected === 4) {
        attr.forEach(hexColor => {
          expect(hexColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
      }
    });
    });



  it('should provide all 4 color deficiency simulations for a given color', () => {
    // Arrange & Act
    const pair = new ColorContrastPairs('#ff0000'); // Reines Rot
    const deficiencies = pair.getDeficiencies("#00ff00");

    // Assert: Der Anwender erwartet ein Array mit genau 4 Simulationswerten 
    // (Protanopie, Deuteranopie, Tritanopie, Grayscale)
    expect(deficiencies).toHaveLength(4);
    deficiencies.forEach(hexColor => {
      expect(hexColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });


  it('should return safe fallbacks when extreme contrast ratios are unreachable', () => {
    // Arrange: Ein mittleres Grau, bei dem extreme Kontraste nach oben/unten 
    // an die Grenzen des HSL-Raums stoßen können.
    const pair_dark = new ColorContrastPairs('#808080');
    const pair_light = new ColorContrastPairs('#3c751d');

    // Act & Assert: Die Getter dürfen nicht crashen, sondern müssen 
    // entweder einen gültigen Wert oder kontrolliert 0 liefern.
    // Selbst wenn die Getter hier etwas finden, prüfen wir, dass der Vertrag hält:
    const ratio_dark = pair_dark.darker70Ratio;
    expect(typeof ratio_dark).toBe('number');
    const ratio_light = pair_light.lighter70Ratio;
    expect(typeof ratio_light).toBe('number');

    // Test für ein bewusst ungültiges oder extremes Szenario, 
    // falls man direkt die Suchfunktion oder Grenzwerte prüft:
    const extremeResult_dark = pair_dark.findThresholdDarkerL(99.0, 0, 0.1); // Unrealistisches Ziel
    expect(extremeResult_dark).toBe('#ffffff');
    const extremeResult_light = pair_light.findThresholdBrighterL(99.0, 0, 0.1); // Unrealistisches Ziel
    expect(extremeResult_light).toBe('#000000');

  });

});

