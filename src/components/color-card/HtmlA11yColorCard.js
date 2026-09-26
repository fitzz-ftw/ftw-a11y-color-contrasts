// @ts-check

/* c8 ignore start */
/**
 * Description placeholder
 *
 * @param {...{}} param 
 */
const _debuglog = (...param) => {
  console.log(...param);
};
/** @param {...{}} _param */
// eslint-disable-next-line no-unused-vars
const _noDebuglog = (..._param) => { };

let debuglog = _debuglog;
// debuglog = _noDebuglog;
/* c8 ignore stop */

import {
  formatRgb,
  formatHsl,
  formatHex,
  wcagContrast,
  hsl,
  // } from "../node_modules/culori/bundled/culori.mjs";
} from "culori";
import { ColorContrastPairs, noneDarker, noneLighter } from "../../utils/ColorContrastPair.js";

// @ts-ignore
import modulecss from '../components.css?inline' with { type: 'css' };
// @ts-ignore
// import modulcss from './HtmlA11yColorCards.css?inline' with { type: 'css' };

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
 * @typedef {"normal"|"bold"|"large"} FontModeEnum
 */

/** 
 * @typedef {"AA"|"AAA"} WCAGModeEnum
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
export class HTMLA11yColorCard extends HTMLElement {
  #root = this.attachShadow({ mode: 'closed' });
  // @ts-ignore


  /**
   * The current color pairs used. A random color, which will be overriden by
   * the "initial-color" HTMLattribute or by the setter curColor.
   *
   * @type {ColorContrastPairs}
   */
  #curColor = new ColorContrastPairs("#18fbf8");


  /**
   * 
   *
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
   * @static
   * @type {Array<FontModeEnum>}
   */
  static #fontModes = ["normal", "bold", "large"];


  /**
   * Description placeholder
   *
   * @type {FontModeEnum}
   */
  #fontMode = HTMLA11yColorCard.#fontModes[0];

  #fontMode2Size = new Map([
    ["normal", "16pt"],
    ["bold", "16pt"],
    ["large", "18pt"],
  ]);

  /**
   * Description placeholder
   *
   * @type {{ family: string; style: "normal"|"italic"; }}
   */
  #previewFont = {
    family: "san-serif",
    style: "normal"
  };

  /**
   * WCGA Categories.
   *
   * @static
   * @type {Array<WCAGModeEnum>}
   */
  static #wcgaModes = ["AA", "AAA"];



  /**
   * Current used WCGA category
   *
   * @type {WCAGModeEnum}
   */
  #wcagMode = HTMLA11yColorCard.#wcgaModes[0];

  static #contrastModes = ["45", "30", "70"];
  #contrastMode = HTMLA11yColorCard.#contrastModes[0];

  /**
   * Description placeholder
   *
   * @static
   * @type {string[]}
   */
  static #colorModes = ["darker", "lighter"];

  /**
   * Description placeholder
   *
   * @type {string}
   */
  #colorMode = HTMLA11yColorCard.#colorModes[0];

  /**
   * 
   *
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
   * 
   *
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
   * Description placeholder
   *
   * @type {string}
   */
  #exampleText = "Beispieltext für Barrierefreiheit";


  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
   */
  #slider;

  /**
   * Creates an instance of HTMLA11yColorCard.
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
   * @static
   * @type {string[]}
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
   */

  connectedCallback() {
    this.#updateUI();

  }


  /**
   * Invoked each time the custom element is disconnected from the document's DOM.
   */
  disconnectedCallback() {
  }

  /**
   * Invoked each time one of the element's observed attributes is added, removed, or changed.
   *
   * @param {string} name - Name of the attribute.
   * @param {string|null} oldValue - The old value of the attribute.
   * @param {string|null} newValue - The new, current value of the attribute.
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
        this.#setFontMode(newValue);
        break;
      case "wcag-mode":
        if (!newValue) return;
        this.#setWcagMode(/** @type {WCAGModeEnum} */(newValue));
        break;
      /* c8 ignore next */
      default:
        throw Error(`Attribute not allowed: ${name} `);
    }
  }


  /** 
   * @returns {ColorContrastPairs}
   */
  get curColor() {
    return this.#curColor;
  }

  /**
   * Description placeholder
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
    // this.#filterModes()
    // this.#calculateContrast()

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

  get exampleText() {
    return this.#exampleText;
  }
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

  get hue() {
    return this.#curColor.hue;
  }
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

  get sat() {
    return this.#curColor.sat;
  }
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

  get previewFont() {
    return JSON.stringify(this.#previewFont);
  }
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
  get mode() {
    return this.#colorMode;
  }
  /** @param {string} value */
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

  get fontMode() {
    return this.#fontMode;
  }
  /** @param  {string} value */
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

  get wcagMode() {
    return this.#wcagMode;
  }
  /** @param  {WCAGModeEnum} value */
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

  get luminescenceSliderValue() {
    return this.#slider.value;
  }
  set luminescenceSliderValue(value) {
    const min = parseFloat(this.#slider.min);
    const max = parseFloat(this.#slider.max);
    const valueF = parseFloat(value);
    if (!this.#slider.disabled
      && min <= valueF
      && max >= valueF
    ) {

      this.#slider.value = `${value}`;
      this.#slider.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }
  }
  get luminescenceSliderMin() {
    return this.#slider.min;
  }

  get luminescenceSliderMax() {
    return this.#slider.max;
  }

  /**
   * Description placeholder
   *
   * @param {string} color 
   * @returns {boolean} 
   */
  isLegalColor(color) {
    debuglog("isLegel",color);
    if ((this.#colorMode.trim() === "darker".trim() && formatHex(color.trim()) === formatHex(noneDarker.trim()))
      || (this.#colorMode.trim() == "lighter".trim() && formatHex(color.trim()) === formatHex(noneLighter.trim())))
      return false;
    return true;
  }
  // 
  #setPreviewFont() {

    /**
     * Set the font to the paragraphs for the preview texts.
     *
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
    switch (type) {
      case "hue":
        hslfg.h = this.#curColor.hue;
        fg = /** @type {string} */(formatHex(hslfg));
        break;
      case "sat":
        hslfg.s = this.#curColor.sat;
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
    const filter = `${this.#colorMode}${this.#contrastMode}`;
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
   * @param {boolean} active 
   * @param {number} value 
   */
  #set_lum_slider(active, value) {
    console.log("set_lumen_slider", active, value, "ColorMode:", this.#colorMode);
    this.removeEventListener("input", this.#set_new_lum);
    // if (!this.#slider) return
    if (!active) {
      this.#slider.disabled = true;
      return;
    }
    this.#slider.disabled = false;
    if (this.#colorMode == "darker") {
      this.#slider.setAttribute("min", "0");
      this.#slider.setAttribute("max", `${value} `);
      this.#slider.setAttribute("value", `${value} `);
      this.#slider.setAttribute("step", `${value / 100} `);
    } else {
      this.#slider.setAttribute("max", "1");
      this.#slider.setAttribute("min", `${value} `);
      this.#slider.setAttribute("value", `${value} `);
      this.#slider.setAttribute("step", `${(1 - value) / 100} `);
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
    console.log("set_new_lum:", value);
    /**
     * Description placeholder
     *
     * @type {NodeListOf<HTMLElement>}
     */
    const colors = this.#root.querySelectorAll(".text-content");
    /**
     * Description placeholder
     *
     * @type {*}
     */
    let newFg;

    /**
     * Description placeholder
     *
     * @type {*}
     */
    let newBg;
    colors.forEach((item, _idx) => {
      if (item.classList.contains("sample-normal")) {

        /**
         * Description placeholder
         *
         * @type {import("culori").Hsl|string}
         */
        let fg = /** @type {import("culori").Hsl} */(hsl(item.dataset.fgColor));
        fg.l = parseFloat(value);
        fg = formatHex(fg);

        /**
         * Description placeholder
         *
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
   * Description placeholder
   *
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
   * 
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

  #updateUI() {
    let ratioFailed = true;
    this.#filterModes();
    this.#calculateContrast();

    /**
     * Description placeholder
     *
     * @type {string}
     */
    // @ts-ignore
    const mainColor = formatHex(this.#curColor.originalColor);
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

          sample.style.setProperty("--contrast-color", `${color} `);
          sample.dataset.fgColor = `${color}`;
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
        const funcr = `${func}Ratio`;
        // @ts-ignore
        let currRatio = parseFloat(this.#curColor[funcr]);
        // @ts-ignore
        this.#updateRatio(
          sample,
          currRatio,
          "failed",
          (currRatio < (parseFloat(this.#contrastMode) / 10))
        );

        this.#updateColorFormats(`${color} `);
      });

    });
    /**
     * Description placeholder
     *
     * @type {[string,string,string,string]}
     */
    const cdvBackground = this.#curColor.originalColorDef;
    this.#curExamplesCVD.forEach(item => {
      const [queryclass, func, idx, minRatio] = item;
      /**
       * Description placeholder
       *
       * @type {HTMLParagraphElement}
       */
      // @ts-ignore
      const sample = /** @type {HTMLParagraphElement} */(this.#root.querySelector(queryclass));
      let color;

      // @ts-ignore
      const cdvColor = this.#curColor[`${func}Def`];
      if (cdvColor[idx] ?? null) {
        color = cdvColor[idx];
      }
      else {
        color = cdvBackground[idx];
      }
      sample.style.setProperty("--contrast-color", color);
      sample.dataset.fgColor = color;


      /**
       * Description placeholder
       *
       * @type {string}
       */
      let backgroundColor = cdvBackground[idx];
      /**
       * Description placeholder
       *
       * @type {number}
       */
      const currRatio = wcagContrast(backgroundColor, color);
      if (currRatio > minRatio) {
        sample.style.setProperty("--contrast-color", color);
      } else {
        sample.style.setProperty("--contrast-color", color);
      }

      sample.style.setProperty("--main-color", backgroundColor);
      sample.dataset.bgColor = backgroundColor;

      this.#updateRatio(
        sample,
        currRatio,
        "failed",
        (currRatio < minRatio)
      );

    });
  }
  // #if !PRODUCTION
  /* c8 ignore start */
  get test_root() {
    return this.#root;
  }


  get test_slider() {
    return this.#slider;
  }

  test_set_contrast = this.#set_contrast;

  test_set_new_lum = this.#set_new_lum;
  /* c8 ignore stop */
  // #endif

}
