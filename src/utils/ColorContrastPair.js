/**
 * @packageDocumentation
 * 
 * ## Abstract
 * 
 * Color contrast pair management and accessibility calculation module.
 * 
 * ## Architecture & Usage
 * 
 * Provides the {@link ColorContrastPairs} class to compute, evaluate, and search for 
 * WCAG-compliant contrast thresholds (lighter and darker variants) as well as 
 * simulating various color vision deficiencies (CVD).
 * 
 */
// @ts-check

// import { formatHex, hsl, wcagContrast, wcagLuminance } from "culori"
import {
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  filterGrayscale,
  formatHex,
  hsl,
  parse,
  wcagContrast,
  wcagLuminance
} from "culori";

/** 
 * @typedef {[string,string, string,string]} ColorTupel -  Tuple containing the 4 values for vision impairment simulations.
 */

/**
 * Marker and init color for all what schould be darker 
 *
 * @type {""}
 */
export const noneDarker = "";
// export const noneDarker = "#ffffff";

/**
 * Marker and init color for all what schould be lighter 
 *
 * @type {""}
 */
export const noneLighter = "";
// export const noneLighter = "#000000";


/**
 * Class for managing contrast pair of a color.
 *
 * @class ColorContrastPairs
 */
export class ColorContrastPairs {
  //SECTION - private vars
  #mainColor;
  // hue
  // chroma
  // lum

  /**
   * Description placeholder
   *
   * @type {string}
   */
  #originalColor;
  #ariaLum = -1;

  #recursions = 15;

  /**
   *
   * @type {string}
   */
  #darker70 = noneDarker;
  /**
   *
   * @type {string}
   */
  #lighter70 = noneLighter;
  /**
   *
   * @type {string}
   */
  #darker45 = noneDarker;
  /**
   *
   * @type {string}
   */
  #lighter45 = noneLighter;
  /**
   *
   * @type {string}
   */
  #darker30 = noneDarker;
  /**
   *
   * @type {string}
   */
  #lighter30 = noneLighter;

  /**
   * Description placeholder
   *
   * @type {number}
   */
  #tolerance = 0.001;

  #deficiency = 1;

  //!SECTION - private vars
  /** 
   * 
   */

  /**
   * Creates an instance of ColorPairs.
   *
   * @param {string} mainColor 
   */
  constructor(mainColor) {
    this.#originalColor = mainColor;
    this.#mainColor = /** @type{import("culori").Hsl} */(hsl(mainColor));
    this.#ariaLum = wcagLuminance(this.#mainColor);
    this.calculate();
  }


  /**
   * Set the hue in degree
   *
   * @type {number}
   */
  set hue(value) {
    this.#mainColor.h = value;

  }

  /**
   * Set the saturation in percent.
   *
   * @type {number}
   */
  set sat(value) {
    this.#mainColor.s = value;
  }

  /**
   * Set the lumenicence in percent.
   *
   * @type {number}
   */
  set lum(value) {
    this.#mainColor.l = value;
  }

  /** The hue in degree */
  get hue() {
    return this.#mainColor.h;
  }

  /** The saturation in percent. */
  get sat() {
    return this.#mainColor.s;
  }

  /** The lumenicence in percent. */
  get lum() {
    return this.#mainColor.l;
  }

  /**
   * The luminicency in aria standard calculation.
   *
   * @type {number}
   */
  get ariaLum() {
    return this.#ariaLum;
  }

  /**
   * The unchanged original color.
   *
   * @type {string}
   */
  get originalColor() {
    return this.#originalColor;
  }
  /**
   * The color value for the 4 color deficiencies from original color.
   *
   * @returns {ColorTupel} - Tuple of colorstrings with the 
   *      deficiencies in following order: red, green, blue and color.
   */
  get originalColorDef() {
    return this.getDeficiencies(/** @type {import("culori").Hsl} */(hsl(this.originalColor)));
  }


  /**
   * The darker color with a contrast of 7:1 to the original color.
   *
   * @type {string}
   */
  get darker70() {
    return this.#darker70;
  }
  /**
   * The color value for the 4 color deficiencies from darker color with 7:1 contrast.
   *
   * @returns {ColorTupel|never[]} - Tuple of colorstrings with the 
   *      deficiencies in following order: red, green, blue and color.
   */
  get darker70Def() {
    if (this.darker70 === noneDarker) { 
      return []; }
      return this.getDeficiencies(this.darker70);
  }
  
  /**
   * The ratio of the darker color with a contrast from at least 7:1.
   *
   * @type {number}
   */
  get darker70Ratio() {
    if (this.darker70 === noneDarker)
      return 0;
    return wcagContrast(this.originalColor, this.darker70);
  }

  /**
   * The lighter color with a contrast of 7:1 to the original color.
   *
   * @readonly
   * @type {string}
   */
  get lighter70() {
    return this.#lighter70;
  }
  /**
   * The color value for the 4 color deficiencies from lighter color with 7:1 contrast.
   *
   * @returns {ColorTupel|never[]} - Tuple of colorstrings with the 
   *      deficiencies in following order: red, green, blue and color.
   */
  get lighter70Def() {
    if (this.lighter70 === noneLighter){ 
      return [];}
      return this.getDeficiencies(this.lighter70);
  }
  /**
   * The ratio of the lighter color with a contrast from at least 7:1.
   *
   * @type {number}
   */
  get lighter70Ratio() {
    if (this.lighter70 === noneLighter)
      return 0;
    return wcagContrast(this.originalColor, this.lighter70);
  }

  /**
   * The darker color with a contrast of 4.5:1 to the original color.
   *
   * @readonly
   * @type {string}
   */
  get darker45() {
    return this.#darker45;
  }
  /**
   * The color value for the 4 color deficiencies from darker color with 4.5:1 contrast.
   *
   * @returns {ColorTupel|never[]} - Tuple of colorstrings with the 
   *      deficiencies in following order: red, green, blue and color.
   */
  get darker45Def() {
    if (this.darker45 === noneDarker){
      return [];}
      return this.getDeficiencies(this.darker45);
  }
  /**
   * The ratio of the darker color with a contrast from at least 4.5:1.
   *
   * @type {number}
   */
  get darker45Ratio() {
    if (this.darker45 === noneDarker)
      return 0;
    return wcagContrast(this.originalColor, this.darker45);
  }

  /**
   * The lighter color with a contrast of 4.5:1 to the original color.
   *
   * @readonly
   * @type {string}
   */
  get lighter45() {
    return this.#lighter45;
  }
  /**
   * The color value for the 4 color deficiencies from lighter color with 4.5:1 contrast.
   *
   * @returns {ColorTupel|never[]} - Tuple of colorstrings with the 
   *      deficiencies in following order: red, green, blue and color.
   */
  get lighter45Def() {
    if (this.lighter45===noneLighter){ 
      return [];}
    return this.getDeficiencies(this.lighter45);
  }
  /**
   * The ratio of the lighter color with a contrast from at least 4.5:1.
   *
   * @type {number}
   */
  get lighter45Ratio() {
    if (this.lighter45 === noneLighter)
      return 0;
    return wcagContrast(this.originalColor, this.lighter45);
  }

  /**
   * The darker color with a contrast of 3:1 to the original color.
   *
   * @readonly
   * @type {string}
   */
  get darker30() {
    return this.#darker30;
  }
  /**
   * The color value for the 4 color deficiencies from darker color with 3:1 contrast.
   *
   * @returns {ColorTupel|never[]} - Tuple of colorstrings with the 
   *      deficiencies in following order: red, green, blue and color.
   */
  get darker30Def() {
    if (this.darker30===noneDarker){ 
      return [];}
    return this.getDeficiencies(this.darker30);
  }
  /**
   * The ratio of the darker color with a contrast from at least 3:1.
   *
   * @type {number}
   */
  get darker30Ratio() {
    if (this.darker30 === noneDarker)
      return 0;
    return wcagContrast(this.originalColor, this.darker30);
  }

  /**
   * The lighter color with a contrast of 3:1 to the original color.
   *
   * @readonly
   * @type {string}
   */
  get lighter30() {
    return this.#lighter30;
  }
  /**
   * The color value for the 4 color deficiencies from lighter color with 3:1 contrast.
   *
   * @returns {ColorTupel|never[]} - Tuple of colorstrings with the 
   *      deficiencies in following order: red, green, blue and color.
   */
  get lighter30Def() {
    if (this.lighter30===noneLighter){
      return [];}
      return this.getDeficiencies(this.lighter30);
  }
  /**
   * The ratio of the lighter color with a contrast from at least 3:1.
   *
   * @type {number}
   */
  get lighter30Ratio() {
    if (this.lighter30 === noneLighter)
      return 0;
    return wcagContrast(this.originalColor, this.lighter30);
  }






  // Protanopie ist eine angeborene Rotblindheit (rot/grün)

  // Deuteranopie ist eine genetisch bedingte Grünblindheit

  /**
   * Create the color value for the 4 color deficiencies.
   *
   * @param {string|import("culori").Color} color 
   * @returns {ColorTupel} Tuple of colorstrings with the 
   *      deficiencies in following order: red, green, blue and color.
   */
  getDeficiencies(color) {
    if (typeof color !== 'string')
      color = /** @type {string} */(formatHex(color));
    
    /**
     * Description placeholder
     *
     * @type {import("culori").Color}
     */
    const colorT = /** @type {import("culori").Color} */(parse(color));
    return [
      formatHex(filterDeficiencyProt(this.#deficiency)(colorT)),
      formatHex(filterDeficiencyDeuter(this.#deficiency)(colorT)),
      formatHex(filterDeficiencyTrit(this.#deficiency)(colorT)),
      formatHex(filterGrayscale(this.#deficiency)(colorT)),
    ];
  }



  /**
   * Helper to test contrast for a given lightness L
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





  /**
   * Binary search implementation for a target contrast ratio within a range [minL, maxL]
   * direction: 'lighter' (searching upwards)
   *
   * @param {number} targetContrast 
   * @param {number} minL 
   * @param {number} maxL 
   * @returns {string} 
   */
  findThresholdBrighterL(targetContrast, minL, maxL) {
    let low = minL;
    let high = maxL;
    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    let bestHex = noneLighter;

    // Für hellere Varianten wollen wir von unten (minL) 
    // nach oben wandern, bis der Kontrast passt, und dann den 
    // sanftesten (niedrigsten) L-Wert finden, der das Ziel erreicht.

    for (let i = 0; i < this.#recursions; i++) {
      const mid = (low + high) / 2;

      /**
       * Description placeholder
       *
       * @type {import("culori").Hsl}
       */
      const testColor = { mode: 'hsl', h: this.hue, s: this.sat, l: mid };
      const hex = formatHex(testColor);
      const currentContrast = wcagContrast(hex, this.#originalColor);

      if (currentContrast >= targetContrast) {
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


    return bestHex;


  }


  /**
   * Binary search implementation for a target contrast ratio within a range [minL, maxL]
   * direction: 'darker' (searching downwards)
   *
   * @param {number} targetContrast 
   * @param {number} minL 
   * @param {number} maxL 
   * @returns {string} 
   */
  findThresholdDarkerL(targetContrast, minL, maxL) {
    let low = minL;
    let high = maxL;
    
    /**
     * Description placeholder
     *
     * @type {string}
     */
    let bestHex = noneDarker;

    for (let i = 0; i < this.#recursions; i++) {
      const mid = (low + high) / 2;

      // 1. HSL-Testobjekt erzeugen

      /**
       * Description placeholder
       *
       * @type {import("culori").Hsl}
       */
      const testColor = { mode: 'hsl', h: this.hue, s: this.sat, l: mid };

      // 2. Direkt in das finale Darstellungsformat (Hex) konvertieren
      const hex = formatHex(testColor);

      // 3. Kontrast exakt gegen diesen finalen Hex-Wert messen
      const currentContrast = wcagContrast(hex, this.#originalColor);

      if (currentContrast >= targetContrast) {
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
    return bestHex;
  }

  /** Calculate the treshholds for the ratio entries. */
  calculate() {
    // --- DARKER VARIANTS SEARCH (Range: [0, bgLum]) ---
    // Scout for 3.0 first, then leverage bounds for 4.5 and 7.0
    this.#darker30 = this.findThresholdDarkerL(3.0, 0, this.lum);
    if (this.#darker30 !== noneDarker) {
   ///   console.log("Calc d30",this.#darker30,hsl(this.#darker30));
      const l30 = /** @type {import("culori").Hsl} */(hsl(this.#darker30))?.l; //||0;
      this.#darker45 = this.findThresholdDarkerL(4.5, 0, l30);
    }
    if (this.#darker45 !== noneDarker) {
      const l45 = /** @type {import("culori").Hsl} */(hsl(this.#darker45))?.l; //||0;
      this.#darker70 = this.findThresholdDarkerL(7.0, 0, l45);
    } else if (this.#darker30 !== noneDarker) {
      this.#darker70 = this.findThresholdDarkerL(7.0, 0, /** @type {import("culori").Hsl} */(hsl(this.#darker30)).l);
    }

    // --- BRIGHTER VARIANTS SEARCH (Range: [bgLum, 1]) ---
    this.#lighter30 = this.findThresholdBrighterL(3.0, this.lum, 1);
    if (this.#lighter30 !== noneLighter) {
      const l30 = /** @type {import("culori").Hsl} */(hsl(this.#lighter30)).l;
      this.#lighter45 = this.findThresholdBrighterL(4.5, l30, 1);
    }
    if (this.#lighter45 !== noneLighter) {
      const l45 = /** @type {import("culori").Hsl} */(hsl(this.#lighter45)).l;
      this.#lighter70 = this.findThresholdBrighterL(7.0, l45, 1);
    } else if (this.#lighter30 !== noneLighter) {
      this.#lighter70 = this.findThresholdBrighterL(7.0, /** @type {import("culori").Hsl} */(hsl(this.#lighter30)).l, 1);
    }

  }
}