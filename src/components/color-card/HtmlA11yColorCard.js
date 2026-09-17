//@ts-check

import {
  formatRgb,
  formatHsl,
  formatHex,
  random,
  wcagContrast,
  hsl,
  // } from "../node_modules/culori/bundled/culori.mjs";
} from "culori";
import ColorContrastPair from "../../utils/ColorContrastPair.js";

// @ts-ignore
import modulcss from '../components.css?inline' with { type: 'css' };
// @ts-ignore
// import modulcss from './HtmlA11yColorCards.css?inline' with { type: 'css' };

console.log(modulcss)

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
`
export class HTMLA11yColorCard extends HTMLElement {
  #root = this.attachShadow({ mode: 'closed' })


  /**
   * The current color pairs used. A random color, which will be overriden by
   * the "initial-color" HTMLattribute or by the setter curColor.
   *
   * @type {ColorContrastPair}
   */
  #curColor = new ColorContrastPair(formatHex(random()) || "#ff0000")


  /**
   * 
   *
   * @type {Array<[string,(color:string)=>string|undefined]>}
  */
  static #formats = [
    [".rgb", formatRgb],
    [".hex", formatHex],
    [".hsl", formatHsl],
  ]


  /**
   * Allowed font modes
   *
   * @static
   * @type {Array<"normal"|"bold"|"large">}
   */
  static #fontModes = ["normal", "bold", "large"]


  /**
   * Description placeholder
   *
   * @type {"normal" | "bold" | "large"}
   */
  #fontMode = HTMLA11yColorCard.#fontModes[0]

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
  }

  /**
   * WCGA Categories.
   *
   * @static
   * @type {Array<"AA"|"AAA">}
   */
  static #wcgaModes = ["AA", "AAA"]



  /**
   * Current used WCGA category
   *
   * @type {"AA" | "AAA"}
   */
  #wcgaMode = HTMLA11yColorCard.#wcgaModes[0]

  static #contrastModes = ["45", "30", "70"]
  #contrastMode = HTMLA11yColorCard.#contrastModes[0]

  /**
   * Description placeholder
   *
   * @static
   * @type {string[]}
   */
  static #colorModes = ["darker", "lighter"]

  /**
   * Description placeholder
   *
   * @type {string}
   */
  #colorMode = HTMLA11yColorCard.#colorModes[0]

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

  ]
  /**
   * Filtered List of examples from `#examples`
   *
   * @type {Array<[string,string,number]>}
   */

  #curExamples = []


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
  ]

  /**
   * Filtered List of examplesCVD from `#examplesCVD`
   *
   * @type {Array<[string,string,number,number]>}
   */
  #curExamplesCVD = []

  /**
   * Description placeholder
   *
   * @type {string}
   */
  #exampleText = "Beispieltext für Barrierefreiheit"


  /**
   * Creates an instance of HTMLA11yColorCard.
  */
  constructor() {
    super();
    this.#root.adoptedStyleSheets = [modulcss]
    this.#root.innerHTML = template


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
      "wcga-mode",
    ];
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    console.log('Element connected')
    this.#filterModes()
    this.#calculateContrast()
    this.#updateUI()
  }

  /** 
   * Invoked each time the custom element is moved to a new document.
   */
  adoptedCallback() {
    console.log('Element moved to new document')
  }

  /**
   * Invoked each time the custom element is disconnected from the document's DOM.
   */
  disconnectedCallback() {
    console.log('Element disconnected')
  }

  /**
   * Invoked each time one of the element's observed attributes is added, removed, or changed.
   *
   * @param {string} name - Name of the attribute.
   * @param {string|null} oldValue - The old value of the attribute.
   * @param {string|null} newValue - The new, current value of the attribute.
  */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Name:', name, ' Values: old:', oldValue, ' new:', newValue)
    if (oldValue == newValue) {
      return
    }
    switch (name) {
      case "initial-color":
        if (!newValue) return
        this.curColor = new ColorContrastPair(newValue)
        break;
      case "mode":
        this.mode = newValue || "darker"
        break;
      case "font-mode":
        if (!newValue) return
        // @ts-ignore
        if (HTMLA11yColorCard.#fontModes.includes(newValue.toLowerCase())) {
          // @ts-ignore
          this.#fontMode = newValue.toLowerCase()
          this.#calculateContrast()
          this.#setPreviewFont()
        }
        break;
      case "wcga-mode":
        if (!newValue) return
        // @ts-ignore
        if (HTMLA11yColorCard.#wcgaModes.includes(newValue.toUpperCase())) {
          // @ts-ignore
          this.#wcgaMode = newValue.toUpperCase()
          this.#calculateContrast()

        }

      default:
        break;
    }
  }

  get curColor() {
    return this.#curColor;
  }
  set curColor(value) {
    this.#curColor = value;
    this.#updateUI()
  }
  get mode() {
    return this.#colorMode;
  }
  set mode(value) {
    if (HTMLA11yColorCard.#colorModes.includes(value.toLowerCase())) {
      this.#colorMode = value;
      this.#filterModes()
    }
  }

  get exampleText() {
    return this.#exampleText;
  }
  set exampleText(value) {
    if (this.#exampleText === value) return
    this.#exampleText = value;
    this.#updateExampleText()
  }

  get hue() {
    return this.#curColor.hue;
  }
  set hue(value) {
    this.#curColor.hue = value;
    this.#updateColorValues("hue")
  }

  get sat() {
    return this.#curColor.sat;
  }
  set sat(value) {
    this.#curColor.sat = value;
    this.#updateColorValues("sat")
  }

  get previewFont() {
    return JSON.stringify(this.#previewFont);
  }
  set previewFont(value) {
    this.#previewFont = JSON.parse(value);
    this.#setPreviewFont()
  }

  #setPreviewFont() {

    /**
     * Set the font to the paragraphs for the preview texts.
     *
     * @type {NodeListOf<HTMLParagraphElement>}
     */
    const previews = this.#root.querySelectorAll(".text-content")
    previews.forEach(item => {
      item.style.setProperty("--preview-font-family", `'${this.#previewFont.family}'`, "important")
      item.style.setProperty("--preview-font-style", this.#previewFont.style, "important")
      const fontSize = this.#fontMode2Size.get(this.#fontMode)
      if (fontSize)
        item.style.setProperty("--preview-font-size",
          fontSize, "important")
      if (this.#fontMode == "bold") {
        item.style.setProperty("--preview-font-weight",
          "bold", "important")
      }
      else {
        item.style.setProperty("--preview-font-weight",
          "normal", "important")
      }
      // console.log(item)
    })
  }
  /**
   * Update the colors for the preview texts if saturation or hue change.
   *
   * @param {string} type - Only 'sat' and 'hue' are suported.
   */
  #updateColorValues(type) {
    // 1. Aktuelle FG holen
    const para = /** @type {HTMLParagraphElement} */(this.#root.querySelector(".text-content.sample-normal"))
    let fg = /** @type {string} */(para.dataset.fgColor)
    const bg = /** @type {string} */(para.dataset.bgColor)
    
    /**
     * Description placeholder
     *
     * @type {import("culori").Hsl}
     */
    const hslfg = /** @type {import("culori").Hsl} */(hsl(fg))
    /**
     * Description placeholder
     *
     * @type {*}
     */
    // let newFg

    /**
     * Description placeholder
     *
     * @type {*}
     */
    // let newBg
    // console.log("Type", type)
    switch (type) {
      case "hue":
        // console.log("alt", fg)
        // console.log("hue", this.#curColor.hue, typeof this.#curColor.hue)
        hslfg.h = parseFloat(this.#curColor.hue)
        fg = /** @type {string} */(formatHex(hslfg))
        // console.log("neu", fg)


        break;
      case "sat":
        // console.log("Before", hslfg, fg)
        hslfg.s = parseFloat(this.#curColor.sat)
        fg = /** @type {string} */(formatHex(hslfg))
        // console.log("After:", hslfg, fg)

        break
      default:
        break;
    }
    para.style.setProperty("--contrast-color", fg)
    para.dataset.fgColor = fg
    const ratio = wcagContrast(bg, fg)
    // console.log("Ratio:", ratio)
    this.#set_lum_slider(true, /** @type {import("culori").Hsl} */(hsl(fg)).l)
    this.#updateRatio(para,
      ratio,
      "failed",
      ratio < (parseFloat(this.#contrastMode) / 10))
    console.log("color:", fg)
    this.#updateColorFormats(fg)
    /**
     * Description placeholder
     *
     * @type {*}
     */
    const newFg = this.#curColor.getDeficiencies(fg)
    /**
     * Description placeholder
     *
     * @type {[string,string,string,string]}
     */
    const newBg = this.#curColor.getDeficiencies(bg)

    // 2. setzen der Fsrben für die Fehlsichtigkeit
    /**
     * Description placeholder
     *
     * @type {NodeListOf<HTMLElement>}
     */
    const colors = this.#root.querySelectorAll(".text-content")
    colors.forEach((item, idx) => {
      if (item.classList.contains("sample-normal")) {
        return
      }
      else if (item.classList.contains("sample-red")) {
        const fg = newFg[0]
        const bg = newBg[0]
        const ratio = wcagContrast(bg, fg)
        item.style.setProperty("--contrast-color", fg)
        item.style.setProperty("--main-color", bg)


        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)))
      } else if (item.classList.contains("sample-green")) {
        const fg = newFg[1]
        const bg = newBg[1]
        const ratio = wcagContrast(bg, fg)
        item.style.setProperty("--contrast-color", fg)
        item.style.setProperty("--main-color", bg)
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)))
      } else if (item.classList.contains("sample-blue")) {
        const fg = newFg[2]
        const bg = newBg[2]
        const ratio = wcagContrast(bg, fg)
        item.style.setProperty("--contrast-color", fg)
        item.style.setProperty("--main-color", bg)
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)))
      } else if (item.classList.contains("sample-color")) {
        const fg = newFg[3]
        const bg = newBg[3]
        const ratio = wcagContrast(bg, fg)
        item.style.setProperty("--contrast-color", fg)
        item.style.setProperty("--main-color", bg)
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)))
      }

    }
    )


  }
  /**
   * Calculate the contastmode from WCGA mode and font mode.
   * 
   * Font mode could be 'normal', 'bold' or 'large',
   * WCGA mode could be 'AA' or 'AAA'.
   */
  #calculateContrast() {
    // console.log("Kontrast:", this.#fontMode)
    // console.log(this.#wcgaMode)
    switch (this.#fontMode) {
      case "normal":
        if (this.#wcgaMode == "AA") {
          this.#set_contrast(4.5)
          this.#createHeader(4.5)
        }
        else {
          this.#set_contrast(7)
          this.#createHeader(7)
        }
        break;
      case "bold":
      case "large":
        if (this.#wcgaMode == "AA") {
          this.#set_contrast(3)
          this.#createHeader(3)
          // console.log("Calculation done.")
        }
        else {
          this.#set_contrast(4.5)
          this.#createHeader(4.5)
        }
        break;

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
    const header = `${this.#fontMode} Text (target: ≥ ${value.toFixed(1)}:1)`
    // @ts-ignore
    this.#root.querySelector(".badge").textContent = header
  }

  /**
   * Filter the nessesary examples needed for this card from the
   * possible examples.
   */
  #filterModes() {
    const filter = `${this.#colorMode}${this.#contrastMode}`
    this.#curExamplesCVD = HTMLA11yColorCard.#examplesCVD.filter(value => value.includes(filter)
    )
    // console.log(this.#curExamplesCVD)
    this.#curExamples = HTMLA11yColorCard.#examples.filter(value => value.includes(filter))
    // console.log(this.#curExamples)
  }

  /**
   * Set contrast mode as string.
   *
   * @param {*} value 
   */
  #set_contrast(value) {
    const val = `${(parseFloat(value) * 10).toFixed(0)}`
    if (HTMLA11yColorCard.#contrastModes.includes(val))
      this.#contrastMode = val;
    else
      console.error(`Wrong contrast mode got ${val} allowed are:`, HTMLA11yColorCard.#contrastModes)
  }

  /**
   * Set the slider for the luminance of this card to its
   * start value. If it can not be done, it deactivate it.
   *
   * @param {boolean} active 
   * @param {number} value 
   */
  #set_lum_slider(active, value) {
    this.slider = this.#root.getElementById("lum-slider")
    if (!this.slider) return
    this.removeEventListener("input", this.#set_new_lum)
    if (!active) {
      this.slider.setAttribute("disabled", "")
      return
    }
    if (this.#colorMode == "darker") {
      this.slider.setAttribute("min", "0")
      this.slider.setAttribute("max", `${value}`)
      this.slider.setAttribute("value", `${value}`)
      this.slider.setAttribute("step", `${value / 100}`)
      // console.log("Darker slider:", 0, value, value/100)

    } else {
      this.slider.setAttribute("max", "1")
      this.slider.setAttribute("min", `${value}`)
      this.slider.setAttribute("value", `${value}`)
      this.slider.setAttribute("step", `${(1 - value) / 100}`)
      // console.log("Lighter slider:", value, 1, (1 - value) / 100)
    }
    this.slider.addEventListener("input", this.#set_new_lum)
  }

  /**
   * Update the colors for the preview texts if the luminace change.
   *
   * @param {InputEvent} event 
   */
  #set_new_lum = (event) => {
    if (!event) return
    // @ts-ignore
    const value = event.target.value

    /**
     * Description placeholder
     *
     * @type {NodeListOf<HTMLElement>}
     */
    const colors = this.#root.querySelectorAll(".text-content")
    // console.log(colors)
    /**
     * Description placeholder
     *
     * @type {*}
     */
    let newFg

    /**
     * Description placeholder
     *
     * @type {*}
     */
    let newBg
    colors.forEach((item, idx) => {
      if (item.classList.contains("sample-normal")) {
        
        /**
         * Description placeholder
         *
         * @type {import("culori").Hsl|string}
         */
        let fg = /** @type {import("culori").Hsl} */(hsl(item.dataset.fgColor))
        const test = fg
        const lum = fg.l
        fg.l = parseFloat(value)
        fg = formatHex(fg)

        /**
         * Description placeholder
         *
         * @type {string}
         */
        const bg = item.dataset.bgColor ?? "#ffffff"
        const ratio = wcagContrast(bg, fg)
        if (idx === 0) {
          // console.log(`Ratio ${idx}:`,
          // ratio,
          // wcagContrast(bg, item.dataset.fgColor),
          // "Value:", value,
          // lum,
          // test
          // )
        }
        item.style.setProperty("--contrast-color", fg)
        newFg = this.#curColor.getDeficiencies(fg)
        newBg = this.#curColor.getDeficiencies(bg)
        this.#updateRatio(item, ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)))
        this.#updateColorFormats(fg)
      } else if (item.classList.contains("sample-red")) {
        const fg = newFg[0]
        const bg = newBg[0]
        const ratio = wcagContrast(bg, fg)
        item.style.setProperty("--contrast-color", fg)
        item.style.setProperty("--main-color", bg)


        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)))
      } else if (item.classList.contains("sample-green")) {
        const fg = newFg[1]
        const bg = newBg[1]
        const ratio = wcagContrast(bg, fg)
        item.style.setProperty("--contrast-color", fg)
        item.style.setProperty("--main-color", bg)
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)))
      } else if (item.classList.contains("sample-blue")) {
        const fg = newFg[2]
        const bg = newBg[2]
        const ratio = wcagContrast(bg, fg)
        item.style.setProperty("--contrast-color", fg)
        item.style.setProperty("--main-color", bg)
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)))
      } else if (item.classList.contains("sample-color")) {
        const fg = newFg[3]
        const bg = newBg[3]
        const ratio = wcagContrast(bg, fg)
        item.style.setProperty("--contrast-color", fg)
        item.style.setProperty("--main-color", bg)
        this.#updateRatio(item,
          ratio,
          "failed",
          (ratio < (parseFloat(this.#contrastMode) / 10)))
      }
    })

  }

  #updateExampleText() {
    const texts = this.#root.querySelectorAll(".text-content")
    texts.forEach(text => {
      text.textContent = this.#exampleText
    })
  }

  /**
   * Description placeholder
   *
   * @param {string} color 
   */
  #updateColorFormats(color) {
    const colorOut = this.#root.querySelector(".contrast-readout.normal45")
    // console.log("ColorFormats", colorOut, color)
    if (colorOut)
      HTMLA11yColorCard.#formats.forEach(format => {
        const [q, f] = format

        const entry = colorOut.querySelector(q)
        // console.log(q, color, entry)
        if (entry)
          if (color)
            entry.textContent = f(color) ?? ""
          else
            entry.textContent = "unmöglich"
      })
  }

  /**
   * 
   * @param {Element} elem 
   * @param {number} ratio
   * @param {string} [cssClass]
   * @param {boolean} [setClass] 
   */
  #updateRatio(elem, ratio, cssClass, setClass) {
    const ratioEntry = elem.previousElementSibling
    // console.log("UR", elem, ratioEntry, ratio, cssClass)
    ratio = ratio ? ratio : 1
    if (ratioEntry) {
      if (cssClass) {
        ratioEntry.classList.remove(cssClass)
      }
      ratioEntry.textContent = `${ratio.toFixed(2)}:1`
      if (cssClass && setClass)
        ratioEntry.classList.add(cssClass)
    }
  }

  #updateUI() {
    let ratioFailed = true
    // console.log(ariacolor.originalColorDef)
    if (this.#curColor === undefined) return

    /**
     * Description placeholder
     *
     * @type {string}
     */
    // @ts-ignore
    const mainColor = formatHex(this.#curColor.originalColor)
    this.#curExamples.forEach((item) => {
      const [query, func, minRatio] = item
      /**
       * Description placeholder
       *
       * @type {NodeListOf<HTMLParagraphElement>}
       */
      const samples = this.#root.querySelectorAll(query)
      // console.log("Func", func, samples)
      // @ts-ignore
      
      /**
       * Description placeholder
       *
       * @type {import("culori").Hsl}
       */
      // @ts-ignore
      const color = this.#curColor[func]
      // console.log("Color", color)
      samples.forEach(sample => {
        if (color !== null) {
          const myColor = hsl(color)

          sample.style.setProperty("--contrast-color", `${color}`)
          sample.dataset.fgColor = `${color}`
          ratioFailed = false
          this.#set_lum_slider(!ratioFailed, 
            /** @type {import("culori").Hsl} */(hsl(color)).l)

        }
        else {
          sample.style.setProperty("--contrast-color", mainColor)
          sample.dataset.fgColor = mainColor
        }

        sample.style.setProperty("--main-color", mainColor)
        sample.dataset.bgColor = mainColor
        const funcr = `${func}Ratio`
        // @ts-ignore
        let currRatio = parseFloat(this.#curColor[funcr])
        console.log("CurRatio:", currRatio)
        // @ts-ignore
        this.#updateRatio(
          sample,
          currRatio,
          "failed",
          (//!ratioFailed 
            //&& 
            currRatio < (parseFloat(this.#contrastMode) / 10))
        )

        this.#updateColorFormats(`${color}`)
      })

    })
    /**
     * Description placeholder
     *
     * @type {[string,string,string,string]}
     */
    const cdvBackground = this.#curColor.originalColorDef;
    this.#curExamplesCVD.forEach(item => {
      const [queryclass, func, idx, minRatio] = item
      // console.log("Example:",item)
      /**
       * Description placeholder
       *
       * @type {HTMLParagraphElement}
       */
      // @ts-ignore
      const sample = this.#root.querySelector(queryclass)
      let color
      // console.log(sample)
      if (sample) {

        // @ts-ignore
        const cdvColor = this.#curColor[`${func}Def`]
        // console.log("CdvColor", cdvColor[idx])
        if (cdvColor[idx] ?? null) {
          color = cdvColor[idx]
        }
        else {
          color = cdvBackground[idx]
        }
        sample.style.setProperty("--contrast-color", color)
        sample.dataset.fgColor = color


        /**
         * Description placeholder
         *
         * @type {string}
         */
        let backgroundColor = cdvBackground[idx]
        // console.log("Ratio", backgroundColor, color)
        // console.log("UI", backgroundColor, color )
        /**
         * Description placeholder
         *
         * @type {number}
         */
        const currRatio = wcagContrast(backgroundColor, color)
        if (currRatio > minRatio) {
          sample.style.setProperty("--contrast-color", color)
        } else {
          sample.style.setProperty("--contrast-color", color)
        }

        sample.style.setProperty("--main-color", backgroundColor)
        sample.dataset.bgColor = backgroundColor

        this.#updateRatio(
          sample,
          currRatio,
          "failed",
          (//!ratioFailed && 
            currRatio < minRatio)
        )
      }

    })
  }
}
