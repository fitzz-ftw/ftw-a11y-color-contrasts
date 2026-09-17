// @ts-check

// import { formatHex, hsl, wcagContrast, wcagLuminance } from "culori"
import {
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  filterGrayscale,
  formatHex,
  hsl,
  wcagContrast,
  wcagLuminance
} from "culori"

export default class ColorContrastPairs {
  #mainColor
  // hue
  // chroma
  // lum
  #originalColor
  #ariaLum

  #recursions = 15

  /**
   *
   * @type {string|undefined|null}
   */
  #darker70
  /**
   *
   * @type {string|undefined|null}
   */
  #lighter70
  /**
   *
   * @type {string|undefined|null}
   */
  #darker45
  /**
   *
   * @type {string|undefined|null}
   */
  #lighter45
  /**
   *
   * @type {string|undefined|null}
   */
  #darker30
  /**
   *
   * @type {string|undefined|null}
   */
  #lighter30

  /**
   * Description placeholder
   *
   * @type {number}
   */
  #tolerance = 0.001

  #deficiency = 1
  /**
   * Creates an instance of ColorPairs.
   *
   * @constructor
   * @param {string|import("culori").Color} mainColor 
   */
  constructor(mainColor) {
    this.#originalColor = mainColor
    this.#mainColor = hsl(mainColor) ?? mainColor;
    this.#ariaLum = wcagLuminance(this.#mainColor)
    this.calculate()
  }

  set hue(value) {
    // @ts-ignore
    this.#mainColor.h = value

  }
  set sat(value) {
    // @ts-ignore
    this.#mainColor.s = value
  }
  set lum(value) {
    // @ts-ignore
    this.#mainColor.l = value
  }
  get hue() {
    // @ts-ignore
    return this.#mainColor.h
  }
  get sat() {
    // @ts-ignore
    return this.#mainColor.s
  }
  get lum() {
    // @ts-ignore
    return this.#mainColor.l
  }
  get ariaLum() {
    return this.#ariaLum
  }

  get originalColor() {
    return this.#originalColor
  }
  /**
   * Description placeholder
   *
   * @readonly
   * @type {[string, string, string,string]}
   */
  get originalColorDef() {
    return this.getDeficiencies(this.originalColor)
  }


  get darker70() {
    return this.#darker70 ?? null
  }
  get darker70Def() {
    if (!this.darker70) return []
    return this.getDeficiencies(this.darker70)
  }
  get darker70Ratio() {
    if (!this.darker70)
      return 0
    return wcagContrast(this.originalColor, this.darker70)
  }

  get lighter70() {
    return this.#lighter70 ?? null
  }
  get lighter70Def() {
    if (!this.lighter70) return []
    return this.getDeficiencies(this.lighter70)
  }
  get lighter70Ratio() {
    if (!this.lighter70)
      return 0
    return wcagContrast(this.originalColor, this.lighter70)
  }

  get darker45() {
    return this.#darker45 ?? null
  }
  get darker45Def() {
    if (!this.darker45) return []
    return this.getDeficiencies(this.darker45)
  }
  get darker45Ratio() {
    if (!this.darker45)
      return 0
    return wcagContrast(this.originalColor, this.darker45)
  }

  get lighter45() {
    return this.#lighter45 ?? null
  }
  get lighter45Def() {
    if (!this.lighter45) return []
    return this.getDeficiencies(this.lighter45)
  }
  get lighter45Ratio() {
    if (!this.lighter45)
      return 0
    return wcagContrast(this.originalColor, this.lighter45)
  }

  get darker30() {
    return this.#darker30 ?? null
  }
  get darker30Def() {
    if (!this.darker30) return []
    return this.getDeficiencies(this.darker30)
  }
  get darker30Ratio() {
    if (!this.darker30)
      return 0
    return wcagContrast(this.originalColor, this.darker30)
  }

  get lighter30() {
    return this.#lighter30 ?? null
  }
  get lighter30Def() {
    if (!this.lighter30) return []
    return this.getDeficiencies(this.lighter30)
  }
  get lighter30Ratio() {
    if (!this.lighter30)
      return 0
    return wcagContrast(this.originalColor, this.lighter30)
  }






  // Protanopie ist eine angeborene Rotblindheit (rot/grün)

  // Deuteranopie ist eine genetisch bedingte Grünblindheit

  /**
   * Description placeholder
   *
   * @param {string|import("culori").Color} color 
   * @returns {[string,string,string,string]} 
   */
  getDeficiencies(color) {
    return [
      // @ts-ignore
      formatHex(filterDeficiencyProt(this.#deficiency)(color)) ?? "",
      // @ts-ignore
      formatHex(filterDeficiencyDeuter(this.#deficiency)(color)) ?? "",
      // @ts-ignore
      formatHex(filterDeficiencyTrit(this.#deficiency)(color)) ?? "",
      // @ts-ignore
      formatHex(filterGrayscale(this.#deficiency)(color)) ?? "",
    ]
  }


  // Helper to test contrast for a given lightness L

  /**
   * Description placeholder
   *
   * @param {number} lVal 
   * @returns {number} 
   */
  getContrastForL(lVal) {

    /**
     * Description placeholder
     *
     * @type {import("culori").Color}
     */
    const testColor = { mode: 'hsl', l: lVal, s: this.sat, h: this.hue };
    return wcagContrast(this.#originalColor, testColor);
  };


  // Binary search implementation for a target contrast ratio within a range [minL, maxL]
  // direction: 'darker' (searching downwards) or 'lighter' (searching upwards)

  /**
   * Description placeholder
   *
   * @param {number} targetContrast 
   * @param {number} minL 
   * @param {number} maxL 
   * @returns {string|null} 
   */
  findThresholdBrighterL_old(targetContrast, minL, maxL) {
    let low = minL;
    let high = maxL;
    let bestL = null;

    // Quick boundary validation
    const contrastAtLow = this.getContrastForL(low);
    const contrastAtHigh = this.getContrastForL(high);

    if (contrastAtHigh < targetContrast && contrastAtLow < targetContrast) {
      return null; // Target unreachable in this range
    }

    for (let i = 0; i < this.#recursions; i++) { // Max 15 iterations for high precision
      const mid = (low + high) / 2;
      const currentContrast = this.getContrastForL(mid);

      if (currentContrast >= targetContrast) {
        bestL = mid;
        // Narrow down towards the background to find the minimum required distance
        if (targetContrast === 3.0) {
          // For darker, higher L is closer to bg; for lighter, lower L is closer to bg
          // Handled via range boundaries passed to the function
        }
        high = mid; // Try to get closer
      } else {
        low = mid; // Need more contrast, push further away from bg
      }

      if ((high - low) < this.#tolerance) break;
    }

    if (bestL !== null) {
      return formatHex({ mode: 'hsl', l: bestL, s: this.sat, h: this.hue }) ?? null;
    }
    return null;
  };

  /**
   * Description placeholder
   *
   * @param {number} targetContrast 
   * @param {number} minL 
   * @param {number} maxL 
   * @returns {string|null} 
   */
  findThresholdBrighterL(targetContrast, minL, maxL) {
    let low = minL;
    let high = maxL;
    let bestL = null;
    let bestHex = null;

    // Für hellere Varianten wollen wir von unten (minL) 
    // nach oben wandern, bis der Kontrast passt, und dann den 
    // sanftesten (niedrigsten) L-Wert finden, der das Ziel erreicht.

    for (let i = 0; i < this.#recursions; i++) {
      const mid = (low + high) / 2;

      const testColor = { mode: 'hsl', h: this.hue, s: this.sat, l: mid };
      const hex = formatHex(testColor);
      const currentContrast = wcagContrast(hex, this.#originalColor);

      if (currentContrast >= targetContrast) {
        bestL = mid;
        bestHex = hex;
        // Genug Kontrast: Versuchen wir, wieder näher 
        // an den Ausgangspunkt heranzugehen (niedrigeres L), 
        // um den subtilsten möglichen Farbton zu finden.
        high = mid;
      } else {
        // Noch nicht genug Kontrast, wir müssen heller werden (höheres L)
        low = mid;
      }

      if ((high - low) < this.#tolerance) break;
    }

    if (bestHex !== null) {
      return bestHex ?? null;
    }
    return null;
  }


  /**
   * Description placeholder
   *
   * @param {number} targetContrast 
   * @param {number} minL 
   * @param {number} maxL 
   * @returns {string|null} 
   */
  findThresholdDarkerL_old(targetContrast, minL, maxL) {
    let low = minL; // z.B. 0 (Schwarz)
    let high = maxL; // z.B. bgLum (Hintergrund)
    let bestL = null;

    // Für dunklere Varianten wollen wir von der Hintergrundnähe (maxL) 
    // nach unten wandern, bis der Kontrast passt, und dann den 
    // sanftesten (höchsten) L-Wert finden, der das Ziel erreicht.

    for (let i = 0; i < this.#recursions; i++) {
      const mid = (low + high) / 2;
      const currentContrast = this.getContrastForL(mid);

      if (currentContrast >= targetContrast) {
        bestL = mid;
        // Wir haben genug Kontrast! Versuchen wir, wieder näher 
        // an den Hintergrund heranzugehen (höheres L für dunkler), 
        // um den subtilsten möglichen Farbton zu finden.
        low = mid;
      } else {
        // Noch nicht genug Kontrast, wir müssen dunkler werden
        high = mid;
      }

      if ((high - low) < this.#tolerance) break;
    }

    if (bestL !== null) {
      return formatHex({ mode: 'hsl', l: bestL, s: this.sat, h: this.hue }) ?? null;
    }
    return null;
  }

  /**
   * Description placeholder
   *
   * @param {number} targetContrast 
   * @param {number} minL 
   * @param {number} maxL 
   * @returns {string|null} 
   */
  findThresholdDarkerL(targetContrast, minL, maxL) {
    let low = minL;
    let high = maxL;
    let bestL = null;
    let bestHex = null;

    for (let i = 0; i < this.#recursions; i++) {
      const mid = (low + high) / 2;

      // 1. HSL-Testobjekt erzeugen
      const testColor = { mode: 'hsl', h: this.hue, s: this.sat, l: mid };

      // 2. Direkt in das finale Darstellungsformat (Hex) konvertieren
      const hex = formatHex(testColor);

      // 3. Kontrast exakt gegen diesen finalen Hex-Wert messen
      const currentContrast = wcagContrast(hex, this.#originalColor);

      if (currentContrast >= targetContrast) {
        bestL = mid;
        bestHex = hex; // Den echten, finalen Hex-Wert sichern
        // Genug Kontrast: Versuche wieder etwas näher an den Hintergrund (heller) heranzugehen
        low = mid;
      } else {
        // Zu wenig Kontrast: Wir müssen dunkler werden
        high = mid;
      }

      if ((high - low) < this.#tolerance) break;
    }

    // Wir geben direkt den validierten Hex-Wert zurück oder mappen ihn sauber
    return bestHex ?? null;
  }

  calculate() {
    // --- DARKER VARIANTS SEARCH (Range: [0, bgLum]) ---
    // Scout for 3.0 first, then leverage bounds for 4.5 and 7.0
    this.#darker30 = this.findThresholdDarkerL(3.0, 0, this.lum);
    if (this.darker30) {
      // @ts-ignore
      const l30 = hsl(this.darker30).l;
      this.#darker45 = this.findThresholdDarkerL(4.5, 0, l30);
    }
    if (this.darker45) {
      // @ts-ignore
      const l45 = hsl(this.darker45).l;
      this.#darker70 = this.findThresholdDarkerL(7.0, 0, l45);
    } else if (this.darker30) {
      // @ts-ignore
      this.#darker70 = this.findThresholdDarkerL(7.0, 0, hsl(this.darker30).l);
    }

    // --- BRIGHTER VARIANTS SEARCH (Range: [bgLum, 1]) ---
    this.#lighter30 = this.findThresholdBrighterL(3.0, this.lum, 1);
    if (this.lighter30) {
      // @ts-ignore
      const l30 = hsl(this.lighter30).l;
      this.#lighter45 = this.findThresholdBrighterL(4.5, l30, 1);
    }
    if (this.lighter45) {
      // @ts-ignore
      const l45 = hsl(this.lighter45).l;
      this.#lighter70 = this.findThresholdBrighterL(7.0, l45, 1);
    } else if (this.lighter30) {
      // @ts-ignore
      this.#lighter70 = this.findThresholdBrighterL(7.0, hsl(this.lighter30).l, 1);
    }

  }
}