/**
 * @packageDocumentation
 * 
 * ## Abstract
 * Web component module for accessibility color contrast evaluation.
 *  
 * ## Architecture & Usage 
 * Provides the {@link HTMLA11yColorCard} custom element to visualize and test 
 * WCAG contrast ratios, supporting different font sizes, WCGA conformance levels (AA/AAA), 
 * and color vision deficiency (CVD) simulations.
 */
// @ts-check

/* c8 ignore start */
/**
 * @param {...{}} param 
 */
const _debuglog = (...param) => {
  console.log(...param);
};
/** @param {...{}} _param */
const _noDebuglog = (..._param) => { };

let debuglog = _debuglog;
debuglog = _noDebuglog;
/* c8 ignore stop */

import {
  formatRgb,
  formatHsl,
  formatHex,
  wcagContrast,
  hsl,
  // } from "../node_modules/culori/bundled/culori.mjs";
} from "culori";
// eslint-disable-next-line no-unused-vars
import { ColorContrastPairs, noneDarker, noneLighter } from "../../utils/ColorContrastPair.js";

// @ts-ignore
import modulecss from '../components.css?inline' with { type: 'css' };

/**
 * The CSSStylesheet for the shadowroot.
 *
 * @type {CSSStyleSheet}
 */
let moduleStyleSheet;
/* c8 ignore else */
if (typeof modulecss == "string") {
  // console.log("String", modulecss)
  moduleStyleSheet = new CSSStyleSheet();
  moduleStyleSheet.replaceSync(modulecss);
  // console.log("Stylesheet", moduleStyleSheet)
} else {
  moduleStyleSheet = modulecss;
}

/** 
 * @typedef {"normal"|"bold"|"large"} FontModeEnum Defines the available font modes for the card.
 * 
 * The WCGA knows three kind of fonts
 * - normal: <18 pt
 * - large: >=18 pt
 * - bold: boldface and >16 pt
 * 
 */

/** 
 * 
 * @typedef {"AA"|"AAA"} WCAGModeEnum
 * Defines the WCAG conformance mode levels.
 * 
 * The WCGA knows two levels:
 * - **AA** Now the standard and entry level.
 * - **AAA** The extended level with higher contrasts.
 */

const template =/*html*/`
<div class="card-container test-card">
  <div class="badge">Normaler Text (Ziel: &ge; 4.5:1)</div>
  <div class="examples-grid">
    <p class="header">Fehl.</p>
    <p class="header">Ratio</p>
    <p class="header">Ansicht</p>
    <p class="row-header">keine</p>
    <p class="row-ratio none">00.0%</p>
    <p
      class="text-content sample-normal contr-45 wcga"
    >
      Beispieltext für Barrierefreiheit
    </p>
    <p class="row-header">rot</p>
    <p class="row-ratio red">4.5%</p>

    <p
      class="text-content sample-red contr-45 wcga-cdv-red"
    >
      Beispieltext für Barrierefreiheit
    </p>
    <p class="row-header">grün</p>
    <p class="row-ratio green">4.5%</p>
    <p
      class="text-content sample-green contr-45 wcga-cdv-green"
    >
      Beispieltext für Barrierefreiheit
    </p>
    <p class="row-header">blau</p>
    <p class="row-ratio blue">4.5%</p>
    <p
      class="text-content sample-blue contr-45 wcga-cdv-blue"
    >
      Beispieltext für Barrierefreiheit
    </p>
    <p class="row-header">color</p>
    <p class="row-ratio color">4.5%</p>
    <p
      class="text-content sample-color contr-45 wcga-cdv-color"
    >
      Beispieltext für Barrierefreiheit
    </p>
  </div>
  <div class="contrast-readout normal45">
    <div class="rowhead">hex:</div>
    <div class="hex">color1</div>
    <div class="rowhead">rgb:</div>
    <div class="rgb">color1</div>
    <div class="rowhead">hsl:</div>
    <div class="hsl">color1</div>
  </div>
  <label for="lum-slider">
    Helligkeit (Lum):
  </label>
  <input
      type="range"
      id="lum-slider"
      min="0"
      max="1"
      step="0.001"
      value="0.5"
    />
</div>
`;



/**
 * Web Component representing an accessibility color card.
 * 
 * This component evaluates and visualizes color contrast ratios according to 
 * official WCAG guidelines. It supports different text modes (normal, bold, large), 
 * conformance levels (AA, AAA), and simulates color vision deficiencies (CVD). 
 * 
 * @class 
 * @extends {HTMLElement}
 */
export class HTMLA11yColorCard extends HTMLElement {
  #root = this.attachShadow({ mode: 'closed' });
  /**
   * The current color pairs used. A random color, which will be overriden by
   * the "initial-color" HTMLattribute or by the setter curColor.
   *
   * @type {ColorContrastPairs}
   */
  #curColor = new ColorContrastPairs("#18fbf8");
  /**
   * @type {Array<[string,(color:string)=>string|undefined]>}
  */
  static #formats = [
    [".rgb", formatRgb],
    [".hex", formatHex],
    [".hsl", formatHsl],
  ];
  /**
   * Allowed font modes
   * 
   * @type {Array<FontModeEnum>}
   */
  static #fontModes = ["normal", "bold", "large"];
  /**
   * @type {FontModeEnum}
   */
  #fontMode = HTMLA11yColorCard.#fontModes[0];

  #fontMode2Size = new Map([
    ["normal", "16pt"],
    ["bold", "16pt"],
    ["large", "18pt"],
  ]);

  /**
   * @type {{ family: string; style: "normal"|"italic"; }}
   */
  #previewFont = {
    family: "san-serif",
    style: "normal"
  };

  /**
   * WCGA Level.
   * 
   * @type {Array<WCAGModeEnum>}
   */
  static #wcgaModes = ["AA", "AAA"];

  /**
   * Current used WCGA level.
   *
   * @type {WCAGModeEnum}
   */
  #wcagMode = HTMLA11yColorCard.#wcgaModes[0];

  static #contrastModes = ["45", "30", "70"];
  #contrastMode = HTMLA11yColorCard.#contrastModes[0];

  /**
   * @type {string[]}
   */
  static #colorModes = ["darker", "lighter"];

  /**
   * @type {string}
   */
  #colorMode = HTMLA11yColorCard.#colorModes[0];

  /**
   * @type {Array<[string,string, number]>}
   */
  static #examples = [
    [".wcga", "darker30", 3],
    [".wcga", "darker45", 4.5],
    [".wcga", "darker70", 7],
    [".wcga", "lighter45", 4.5],
    [".wcga", "lighter30", 3],
    [".wcga", "lighter70", 7],

  ];
  /**
   * Filtered List of examples from `#examples`
   *
   * @type {Array<[string,string,number]>}
   */

  #curExamples = [];


  /**
   * @type {Array<[string,string,number,number]>}
   */
  static #examplesCVD = [
    [".wcga-cdv-red", "darker45", 0, 4.5],
    [".wcga-cdv-green", "darker45", 1, 4.5],
    [".wcga-cdv-blue", "darker45", 2, 4.5],
    [".wcga-cdv-color", "darker45", 3, 4.5],

    [".wcga-cdv-red", "darker30", 0, 3],
    [".wcga-cdv-green", "darker30", 1, 3],
    [".wcga-cdv-blue", "darker30", 2, 3],
    [".wcga-cdv-color", "darker30", 3, 3],

    [".wcga-cdv-red", "darker70", 0, 7],
    [".wcga-cdv-green", "darker70", 1, 7],
    [".wcga-cdv-blue", "darker70", 2, 7],
    [".wcga-cdv-color", "darker70", 3, 7],

    [".wcga-cdv-red", "lighter45", 0, 4.5],
    [".wcga-cdv-green", "lighter45", 1, 4.5],
    [".wcga-cdv-blue", "lighter45", 2, 4.5],
    [".wcga-cdv-color", "lighter45", 3, 4.5],

    [".wcga-cdv-red", "lighter30", 0, 3],
    [".wcga-cdv-green", "lighter30", 1, 3],
    [".wcga-cdv-blue", "lighter30", 2, 3],
    [".wcga-cdv-color", "lighter30", 3, 3],

    [".wcga-cdv-red", "lighter70", 0, 7],
    [".wcga-cdv-green", "lighter70", 1, 7],
    [".wcga-cdv-blue", "lighter70", 2, 7],
    [".wcga-cdv-color", "lighter70", 3, 7],
  ];

  /**
   * Filtered List of examplesCVD from `#examplesCVD`
   *
   * @type {Array<[string,string,number,number]>}
   */
  #curExamplesCVD = [];

  /**
   * @type {string}
   */
  #exampleText = "Beispieltext für Barrierefreiheit";


  /**
   * @type {HTMLInputElement}
  */
  #slider;

  /**
   * Create an instance of {@link HTMLA11yColorCard}.
  */
  constructor() {
    super();
    this.#root.adoptedStyleSheets = [moduleStyleSheet];
    this.#root.innerHTML = template;
    this.#slider = /** @type {HTMLInputElement} */(this.#root.getElementById("lum-slider"));
  }

  /**
   * Defines the attributes that should trigger attributeChangedCallback when modified.
   *
   * @type {string[]}
   * @internal
  */
  static get observedAttributes() {
    return [
      'mode',
      "initial-color",
      "font-mode",
      "wcag-mode",
    ];
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   * @internal
   */
  connectedCallback() {
    this.#updateUI();

  }


  /**
   * Invoked each time the custom element is disconnected from the document's DOM.
   * @internal
   */
  disconnectedCallback() {
  }

  /**
   * Invoked each time one of the element's observed attributes is added, removed, or changed.
   *
   * @param {string} name - Name of the attribute.
   * @param {string|null} oldValue - The old value of the attribute.
   * @param {string|null} newValue - The new, current value of the attribute.
   * @internal
  */
  attributeChangedCallback(name, oldValue, newValue) {
    // console.log('Name:', name, ' Values: old:', oldValue, ' new:', newValue)
    if (oldValue == newValue) {
      return;
    }
    switch (name) {
      case "initial-color":
        if (!newValue) return;
        this.curColor = new ColorContrastPairs(newValue);
        break;
      case "mode":
        this.#setMode(newValue || "darker");
        break;
      case "font-mode":
        if (!newValue) return;
        this.#setFontMode(/** @type {FontModeEnum} */(newValue));
        break;
      case "wcag-mode":
        if (!newValue) return;
        this.#setWcagMode(/** @type {WCAGModeEnum} */(newValue));
        break;
      /* c8 ignore next */
      default:
        throw Error(`Attribute not allowed: ${name}`.trim());
    }
  }


  /** 
   * Get the currend color.
   * @returns {ColorContrastPairs}
   */
  get curColor() {
    return this.#curColor;
  }

  /**
   * Set the currend color.
   *
   * @param {ColorContrastPairs|string} value
   */
  set curColor(value) {
    const oV = this.#curColor;
    if (typeof value === 'string') {
      if (value === this.#curColor.originalColor) return;
      this.#curColor = new ColorContrastPairs(value);
    } else {
      if (value.originalColor == this.#curColor.originalColor) return;
      this.#curColor = value;
    }

    this.#updateUI();
    this.dispatchEvent(new CustomEvent('current-color-changed', {
      detail: {
        id: this.id,
        oldValue: oV.originalColor,
        newValue: this.#curColor.originalColor
      },
      bubbles: true, // Bubbles up to window
      composed: true // Can leave shadow DOM
    }));
  }
  /**
   * Get the example text displayed on the card.
   * @type {string}
   */
  get exampleText() {
    return this.#exampleText;
  }

  /**
  * Set the example text displayed on the card.
  * @type {string}
  */
  set exampleText(value) {
    if (this.#exampleText === value) return;
    const oV = this.#exampleText;
    this.#exampleText = value;
    this.#updateExampleText();
    this.dispatchEvent(new CustomEvent('example-text-changed', {
      detail: {
        id: this.id,
        oldValue: oV,
        newValue: this.exampleText
      },
      bubbles: true, // Bubbles up to window
      composed: true // Can leave shadow DOM
    }));
  }

  /**
 * Get the hue component value.
 * @type {number}
 */
  get hue() {
    return /** @type {number} */(this.#curColor.hue);
  }
  /**
 * Set the hue component value.
 * @type {number}
 */
  set hue(value) {
    const oV = this.#curColor.hue;
    if (oV == value) return;
    this.#curColor.hue = value;
    this.#updateColorValues("hue");
    this.dispatchEvent(new CustomEvent('hue-changed', {
      detail: {
        id: this.id,
        oldValue: oV,
        newValue: this.#curColor.hue

      },
      bubbles: true, // Bubbles up to window
      composed: true // Can leave shadow DOM
    }));
  }

  /**
 * Get the saturation component value.
 * @type {number}
 */
  get sat() {
    return this.#curColor.sat;
  }
  /**
   * Set the saturation component value.
   * @type {number}
  */
  set sat(value) {
    const oV = this.#curColor.sat;
    if (value == oV) return;
    this.#curColor.sat = value;
    this.#updateColorValues("sat");
    this.dispatchEvent(new CustomEvent('saturation-changed', {
      detail: {
        id: this.id,
        oldValue: oV,
        newValue: this.#curColor.sat

      },
      bubbles: true, // Bubbles up to window
      composed: true // Can leave shadow DOM
    }));
  }

  /**
 * Get the font family used for the text preview.
 * @type {string}
 */
  get previewFont() {
    return JSON.stringify(this.#previewFont);
  }
  /**
 * Set the font family used for the text preview.
 * @type {string}
 */
  set previewFont(value) {
    const oV = JSON.stringify(this.#previewFont);
    if (oV == value) return;
    this.#previewFont = JSON.parse(value);
    this.#setPreviewFont();
    this.dispatchEvent(new CustomEvent('font-changed', {
      detail: {
        id: this.id,
        oldValue: oV,
        newValue: JSON.stringify(this.#previewFont)
      },
      bubbles: true, // Bubbles up to window
      composed: true // Can leave shadow DOM
    }));
  }
  /**
 * Get the active display mode.
 * @type {string}
 */
  get mode() {
    return this.#colorMode;
  }
  /** 
   * Set the active display mode.
   * @param {string} value 
  */
  #setMode(value) {
    if (HTMLA11yColorCard.#colorModes.includes(value.toLowerCase())) {
      const oV = this.#colorMode.toLocaleLowerCase();
      this.#colorMode = value.toLowerCase();
      this.#filterModes();
      this.dispatchEvent(new CustomEvent('color-mode-changed', {
        detail: {
          id: this.id,
          oldValue: oV,
          newValue: this.#colorMode.toLocaleLowerCase()

        },
        bubbles: true, // Bubbles up to window
        composed: true // Can leave shadow DOM
      }));
    }
  }
  /**
   * Get the font mode.
   * @type {FontModeEnum}
   */
  get fontMode() {
    return this.#fontMode;
  }
  /**
 * Set the font mode.
 * @param  {FontModeEnum} value 
 * */
  #setFontMode(value) {
    const nV = /** @type {FontModeEnum} */(value.toLowerCase());
    if (HTMLA11yColorCard.#fontModes.includes(nV)) {
      const oV = this.#fontMode;
      this.#fontMode = nV;
      this.#calculateContrast();
      this.#setPreviewFont();
      this.dispatchEvent(new CustomEvent('font-mode-changed', {
        detail: {
          id: this.id,
          oldValue: oV,
          newValue: this.#fontMode
        },
        bubbles: true, // Bubbles up to window
        composed: true // Can leave shadow DOM
      }));
    }
  }

  /**
 * Get the WCAG compliance target level.
 * @type {WCAGModeEnum}
 */
  get wcagMode() {
    return this.#wcagMode;
  }
  /** 
   * Set the WCAG compliance target level.
   * @param  {WCAGModeEnum} value 
   */
  #setWcagMode(value) {
    const nV = /** @type {WCAGModeEnum} */(value.toUpperCase());
    if (HTMLA11yColorCard.#wcgaModes.includes(nV)) {
      const oV = this.#wcagMode;
      this.#wcagMode = nV;
      this.#calculateContrast();
      this.dispatchEvent(new CustomEvent('wcga-mode-changed', {
        detail: {
          id: this.id,
          oldValue: oV,
          newValue: this.#wcagMode
        },
        bubbles: true, // Bubbles up to window
        composed: true // Can leave shadow DOM
      }));
    }
  }

  /**
 * Get the current value of the luminescence slider.
 * @type {string}
 */
  get luminescenceSliderValue() {
    return this.#slider.value;
  }
  /**
 * Set the current value of the luminescence slider.
 * @type {number}
 */
  set luminescenceSliderValue(value) {
    const min = parseFloat(this.#slider.min);
    const max = parseFloat(this.#slider.max);
    const valueF = parseFloat(value);
    /// console.log("lumSliderValue", value, valueF, min, max);
    if (!this.#slider.disabled
      && min <= valueF
      && max >= valueF
    ) {

      this.#slider.value = `${value}`.trim();
      this.#slider.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }
  }
  /**
 * Get the minimum allowed value for the luminescence slider.
 * @type {string}
 */
  get luminescenceSliderMin() {
    return this.#slider.min;
  }
  /**
   * Get the maximum allowed value for the luminescence slider.
   * @type {string}
   */
  get luminescenceSliderMax() {
    return this.#slider.max;
  }

  /**
   * @param {string} color Color to test.
   * @returns {boolean} 
   */
  isLegalColor(color) {
    // if ((this.#colorMode.trim() === "darker".trim() && formatHex(color.trim()) === formatHex(noneDarker.trim()))
    //   || (this.#colorMode.trim() == "lighter".trim() && formatHex(color.trim()) === formatHex(noneLighter.trim())))
    //   return false;
    // return true;
    let retC = false;
    if (color)
      retC = true;
    debuglog("isLegel", retC, color);
    return retC;
  }
  /**
   * Set the font to the paragraphs for the preview texts.
   *
  */
  #setPreviewFont() {
    /**
     * @type {NodeListOf<HTMLParagraphElement>}
     */
    const previews = this.#root.querySelectorAll(".text-content");
    previews.forEach(item => {
      item.style.setProperty("--preview-font-family", `'${this.#previewFont.family}'`, "important");
      item.style.setProperty("--preview-font-style", this.#previewFont.style, "important");
      const fontSize = /** @type {string} */(this.#fontMode2Size.get(this.#fontMode));
      item.style.setProperty("--preview-font-size",
        fontSize, "important");
      if (this.#fontMode == "bold") {
        item.style.setProperty("--preview-font-weight",
          "bold", "important");
      }
      else {
        item.style.setProperty("--preview-font-weight",
          "normal", "important");
      }
    });
  }
  /**
   * Update the colors for the preview texts if saturation or hue change.
   *
   * @param {string} type - Only 'sat' and 'hue' are suported.
   */
  #updateColorValues(type) {
    // 1. Aktuelle FG holen
    const para = /** @type {HTMLParagraphElement} */(this.#root.querySelector(".text-content.sample-normal"));
    let fg = /** @type {string} */(para.dataset.fgColor);
    const bg = /** @type {string} */(para.dataset.bgColor);
    /**
     * Description placeholder
     *
     * @type {import("culori").Hsl}
     */
    const hslfg = /** @type {import("culori").Hsl} */(hsl(fg));
    // switch (type) {
    //   case "hue":
    //     hslfg.h = this.#curColor.hue;
    //     fg = /** @type {string} */(formatHex(hslfg));
    //     break;
    //   case "sat":
    //     hslfg.s = this.#curColor.sat;
    //     fg = /** @type {string} */(formatHex(hslfg));
    //     break;
    //   /* c8 ignore next */
    //   default:
    //     break;
    // }
    switch (type) {
      case "sat":
        hslfg.s = this.#curColor.sat;
        if (hslfg.s == 0) {
          fg = /** @type {string} */(formatHex(hslfg));
          break;
        };
      // eslint-disable-next-line no-fallthrough
      case "hue":
        hslfg.h = this.#curColor.hue;
        fg = /** @type {string} */(formatHex(hslfg));
        break;
      /* c8 ignore next */
      default:
        break;
    }

    para.style.setProperty("--contrast-color", fg);
    para.dataset.fgColor = fg;
    const ratio = wcagContrast(bg, fg);
    this.#set_lum_slider(true, /** @type {import("culori").Hsl} */(hsl(fg)).l);
    this.#updateRatio(para,
      ratio,
      "failed",
      ratio < (parseFloat(this.#contrastMode) / 10));
    this.#updateColorFormats(fg);
    /**
     * Description placeholder
     *
     * @type {*}
     */
    const newFg = this.#curColor.getDeficiencies(fg);
    /**
     * Description placeholder
     *
     * @type {[string,string,string,string]}
     */
    const newBg = this.#curColor.getDeficiencies(bg);

    // 2. setzen der Fsrben für die Fehlsichtigkeit
    /**
     * Description placeholder
     *
     * @type {NodeListOf<HTMLElement>}
     */
    const colors = this.#root.querySelectorAll(".text-content");
    colors.forEach((item, _idx) => {
      if (item.classList.contains("sample-normal")) {
        return;
      }
      else if (item.classList.contains("sample-red")) {
        const fg = newFg[0];
        const bg = newBg[0];
        const ratio = wcagContrast(bg, fg);
        item.style.setProperty("--contrast-color", fg);
        item.style.setProperty("--main-color", bg);


        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)));
      } else if (item.classList.contains("sample-green")) {
        const fg = newFg[1];
        const bg = newBg[1];
        const ratio = wcagContrast(bg, fg);
        item.style.setProperty("--contrast-color", fg);
        item.style.setProperty("--main-color", bg);
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)));
      } else if (item.classList.contains("sample-blue")) {
        const fg = newFg[2];
        const bg = newBg[2];
        const ratio = wcagContrast(bg, fg);
        item.style.setProperty("--contrast-color", fg);
        item.style.setProperty("--main-color", bg);
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)));
      } else
        // c8 ignore else
        if (item.classList.contains("sample-color")) {
          const fg = newFg[3];
          const bg = newBg[3];
          const ratio = wcagContrast(bg, fg);
          item.style.setProperty("--contrast-color", fg);
          item.style.setProperty("--main-color", bg);
          this.#updateRatio(item,
            ratio,
            "failed",
            (ratio < (parseFloat(this.#contrastMode) / 10)));
        }

    }
    );


  }
  /**
   * Calculate the contastmode from WCGA mode and font mode.
   * 
   * Font mode could be 'normal', 'bold' or 'large',
   * WCGA mode could be 'AA' or 'AAA'.
   */
  #calculateContrast() {
    switch (this.#fontMode) {
      case "normal":
        if (this.#wcagMode == "AA") {
          this.#set_contrast(4.5);
          this.#createHeader(4.5);
        }
        else {
          this.#set_contrast(7);
          this.#createHeader(7);
        }
        break;
      case "bold":
      case "large":
        if (this.#wcagMode == "AA") {
          this.#set_contrast(3);
          this.#createHeader(3);
        }
        else {
          this.#set_contrast(4.5);
          this.#createHeader(4.5);
        }
        break;
      /* c8 ignore next */
      default:
        break;
    }
  }
  /**
   * Create and set the header of this card.
   * 
   * @param {number} value - The contast value.
   */
  #createHeader(value) {
    const header = `${this.#fontMode} Text(target: ≥ ${value.toFixed(1)}: 1)`;
    // @ts-ignore
    this.#root.querySelector(".badge").textContent = header;
  }

  /**
   * Filter the nessesary examples needed for this card from the
   * possible examples.
   */
  #filterModes() {
    const filter = `${this.#colorMode}${this.#contrastMode}`.trim();
    this.#curExamplesCVD = HTMLA11yColorCard.#examplesCVD.filter(value => value.includes(filter.trim())
    );
    this.#curExamples = HTMLA11yColorCard.#examples.filter(value => value.includes(filter.trim()));

  }

  /**
   * Set contrast mode as string.
   *
   * @param {*} value 
   */
  #set_contrast(value) {
    const val = `${(parseFloat(value) * 10).toFixed(0)}`.trim();
    if (HTMLA11yColorCard.#contrastModes.includes(val)) {
      this.#contrastMode = val;
    }
    else
      console.warn(`Wrong contrast mode got ${val} allowed are: ${HTMLA11yColorCard.#contrastModes}`);
  }

  /**
   * Set the slider for the luminance of this card to its
   * start value. If it can not be done, it deactivate it.
   *
   * @param {boolean} enabled The slider is enabled  or disabled
   * @param {number} value The value of the slider
   */
  #set_lum_slider(enabled, value) {
    this.removeEventListener("input", this.#set_new_lum);
    if (!enabled) {
      this.#slider.disabled = true;
      this.#slider.setAttribute("min", "0");
      this.#slider.setAttribute("max", "1");
      this.#slider.setAttribute("value", `${value}`.trim());
      return;
    }
    this.#slider.disabled = false;
    if (this.#colorMode == "darker") {
      this.#slider.setAttribute("min", "0");
      this.#slider.setAttribute("max", `${value}`.trim());
      this.#slider.setAttribute("value", `${value}`.trim());
      this.#slider.setAttribute("step", `${value / 100}`.trim());
    } else {
      this.#slider.setAttribute("max", "1");
      this.#slider.setAttribute("min", `${value}`.trim());
      this.#slider.setAttribute("value", `${value}`.trim());
      this.#slider.setAttribute("step", `${(1 - value) / 100}`.trim());
    }
    this.#slider.addEventListener("input", this.#set_new_lum);
  }

  /**
   * Update the colors for the preview texts if the luminace change.
   *
   * @param {InputEvent} event 
   */
  #set_new_lum = (event) => {
    /** @type {string} */
    const value = /** @type {HTMLInputElement} */ (event.target).value;

    // const min = parseFloat(this.#slider.min);
    // const max = parseFloat(this.#slider.max);
    // const valueF = parseFloat(value);
    // /// console.log("lumSliderValue", value, valueF, min, max);
    /**
     * Description placeholder
     *
     * @type {NodeListOf<HTMLElement>}
     */
    const colors = this.#root.querySelectorAll(".text-content");
    /**
     * @type {import("../../utils/ColorContrastPair.js").ColorTupel}
     */
    let newFg;

    /**
     * @type {import("../../utils/ColorContrastPair.js").ColorTupel}
     */
    let newBg;
    colors.forEach((item, _idx) => {
      if (item.classList.contains("sample-normal")) {

        /**
         * @type {import("culori").Hsl|string}
         */
        let fg = /** @type {import("culori").Hsl} */(hsl(item.dataset.fgColor));
        fg.l = parseFloat(value);

        fg = formatHex(fg);


        /**
         * @type {string}
         */
        const bg = /** @type {string} */(item.dataset.bgColor);
        const ratio = wcagContrast(bg, fg);
        item.style.setProperty("--contrast-color", fg);
        newFg = this.#curColor.getDeficiencies(fg);
        newBg = this.#curColor.getDeficiencies(bg);
        this.#updateRatio(item, ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)));
        this.#updateColorFormats(fg);
      } else if (item.classList.contains("sample-red")) {
        const fg = newFg[0];
        const bg = newBg[0];
        const ratio = wcagContrast(bg, fg);
        item.style.setProperty("--contrast-color", fg);
        item.style.setProperty("--main-color", bg);
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)));
      } else if (item.classList.contains("sample-green")) {
        const fg = newFg[1];
        const bg = newBg[1];
        const ratio = wcagContrast(bg, fg);
        item.style.setProperty("--contrast-color", fg);
        item.style.setProperty("--main-color", bg);
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)));
      } else if (item.classList.contains("sample-blue")) {
        const fg = newFg[2];
        const bg = newBg[2];
        const ratio = wcagContrast(bg, fg);
        item.style.setProperty("--contrast-color", fg);
        item.style.setProperty("--main-color", bg);
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)));
      } else /* c8 ignore else*/ if (item.classList.contains("sample-color")) {
        const fg = newFg[3];
        const bg = newBg[3];
        const ratio = wcagContrast(bg, fg);
        item.style.setProperty("--contrast-color", fg);
        item.style.setProperty("--main-color", bg);
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)));
      }
    });

  };

  #updateExampleText() {
    const texts = this.#root.querySelectorAll(".text-content");
    texts.forEach(text => {
      text.textContent = this.#exampleText;
    });
  }


  /**
   * Update the color format
   * @param {string} color 
   */
  #updateColorFormats(color) {
    color = color.trim();
    const colorOut = /** @type {HTMLElement} */(this.#root.querySelector(".contrast-readout.normal45"));
    HTMLA11yColorCard.#formats.forEach(format => {
      const [q, f] = format;

      const entry = /** @type {HTMLElement} */(colorOut.querySelector(q));
      if (this.isLegalColor(color))
        entry.textContent = /** @type {string} */(f(color));
      else
        entry.textContent = "unmöglich";
    });
  }

  /**
   * Update the ratio section of the card
   * @param {Element} elem 
   * @param {number} ratio
   * @param {string} cssClass
   * @param {boolean} setClass 
   */
  #updateRatio(elem, ratio, cssClass, setClass) {
    const ratioEntry = /** @type {HTMLElement} */(elem.previousElementSibling);
    ratio = ratio ? ratio : 1;
    ratioEntry.classList.remove(cssClass);
    ratioEntry.textContent = `${ratio.toFixed(2)}: 1`;
    if (setClass)
      ratioEntry.classList.add(cssClass);
  }


  /** Update the whole UI */
  #updateUI() {
    let ratioFailed = true;
    this.#filterModes();
    this.#calculateContrast();

    /**
     * @type {string}
     */
    const mainColor = /**@type {string}*/(formatHex(this.#curColor.originalColor));
    this.#curExamples.forEach((item) => {
      // eslint-disable-next-line no-unused-vars
      const [query, func, minRatio] = item;
      /**
       * Description placeholder
       *
       * @type {NodeListOf<HTMLParagraphElement>}
       */
      const samples = this.#root.querySelectorAll(query);
      /**
       * Description placeholder
       *
       * @type {import("culori").Hsl}
       */
      // @ts-ignore
      const color = this.#curColor[func];
      samples.forEach(sample => {
        if (this.isLegalColor(formatHex(color))) {

          sample.style.setProperty("--contrast-color", `${color}`.trim());
          sample.dataset.fgColor = `${color}`.trim();
          ratioFailed = false;
          this.#set_lum_slider(!ratioFailed,
            /** @type {import("culori").Hsl} */(hsl(color)).l);
        }
        else {
          sample.style.setProperty("--contrast-color", mainColor);
          sample.dataset.fgColor = mainColor;
          this.#set_lum_slider(!ratioFailed, 0.5);
        }
        sample.style.setProperty("--main-color", mainColor);
        sample.dataset.bgColor = mainColor;
        const funcr = `${func}Ratio`.replace(" ", "");
        // @ts-ignore
        let currRatio = parseFloat(this.#curColor[funcr]);
        this.#updateRatio(
          sample,
          currRatio,
          "failed",
          (currRatio < (parseFloat(this.#contrastMode) / 10))
        );

        this.#updateColorFormats(`${color}`.trim());
      });

    });
    /**
     * @type {import("../../utils/ColorContrastPair.js").ColorTupel}
     */
    const cdvBackground = this.#curColor.originalColorDef;
    this.#curExamplesCVD.forEach(item => {
      const [queryclass, func, idx, minRatio] = item;
      /**
        * @type {HTMLParagraphElement}
       */
      const sampleParagraphs = /** @type {HTMLParagraphElement} */(this.#root.querySelector(queryclass));
      let color;

      const funcDef = `${func}Def`.replace(" ", "").trim();
      /**
       * @type {import("../../utils/ColorContrastPair.js").ColorTupel}
       */
      // @ts-ignore
      const cdvColor = /** @type {import("../../utils/ColorContrastPair.js").ColorTupel}*/(this.#curColor[funcDef]);
      if (cdvColor[idx]) {
        color = cdvColor[idx];
      }
      else {
        color = cdvBackground[idx];
      }
      sampleParagraphs.style.setProperty("--contrast-color", color);
      sampleParagraphs.dataset.fgColor = color;


      /**
       * @type {string}
       */
      let backgroundColor = cdvBackground[idx];
      /**
       * @type {number}
       */
      const currRatio = wcagContrast(backgroundColor, color);
      if (currRatio > minRatio) {
        sampleParagraphs.style.setProperty("--contrast-color", color);
      } else {
        sampleParagraphs.style.setProperty("--contrast-color", color);
      }

      sampleParagraphs.style.setProperty("--main-color", backgroundColor);
      sampleParagraphs.dataset.bgColor = backgroundColor;

      this.#updateRatio(
        sampleParagraphs,
        currRatio,
        "failed",
        (currRatio < minRatio)
      );

    });
  }
  // #if !PROD
  /* c8 ignore start */
  /**
   * @showGroups
   * @module
   */

  /**
   * Description placeholder
   *
   * @group Testing
   * @type {ShadowRoot}
   */
  get test_root() {
    return this.#root;
  }

  /**
   * Description placeholder
   *
   * @group Testing
   * @type {HTMLInputElement}
   */
  get test_slider() {
    return this.#slider;
  }

  /**
   * Description placeholder
   *
   * @group Testing
   * @type {(value: any) => void}
   */
  test_set_contrast = this.#set_contrast;

  /**
   * Description placeholder
   * @group Testing
   * @type {(event: InputEvent) => void}
   */
  test_set_new_lum = this.#set_new_lum;


  /**
   * Get the currend caluculated hue fron this card.
   * 
   * @group Testing
   * @returns {number|null} 
   */
  test_get_curr_hue() {

    const colorOut = /** @type {HTMLElement} */(this.#root.querySelector(".contrast-readout.normal45"));
    const entry = /** @type {HTMLElement} */(colorOut.querySelector(".hsl"));
    const hslString = entry.innerText;
    const match = hslString.match(/hsl\(\s*([0-9.]+)/);
    const hueValue = match ? parseFloat(match[1]) : null;
    return hueValue;
  }
  /* c8 ignore stop */
  // #endif

}
