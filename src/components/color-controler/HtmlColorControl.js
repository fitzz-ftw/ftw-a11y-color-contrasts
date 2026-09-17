//@ts-check

import {
  hsl,
  // } from "../node_modules/culori/bundled/culori.mjs";
} from "culori";
import ColorContrastPairs from "../../utils/ColorContrastPair.js";

import { getSortedFontListWithKey, populateFontSelect } from "../../utils/get-fonts.js"
import { HTMLA11yColorCard } from "../color-card/HtmlA11yColorCard.js";

// @ts-ignore
import modulcss from '../components.css?inline' with { type: 'css' };
// @ts-ignore
// import modulcss from './HtmlColorControl.css?inline' with { type: 'css' };



/**
 * @enum {string}
 */
export const ControlEventType = Object.freeze({
  INITIAL: "initial",
  BASE_COLOR: "base-color",
  PREVIEW_TEXT: "preview-text",
  FONT_FAMILY: "font-family",
  HUE: "hue",
  SATURATION: "saturation"
});

/**
 * @typedef {object} ChangedData
 * @property {string|null} old
 * @property {string|null} new 
 * 
 */
/**
 * @typedef {object} OnChangeDetail
 * @property {ChangedData} hue
 * @property {ChangedData} sat
 * @property {ChangedData} font
 * @property {ChangedData} text
 * @property {ChangedData} color
 * @property {ControlEventType[keyof ControlEventType]} eventsource
 */



const template =/*html*/`
<form class="test-card"id="control-form">
  <label class="row">
    Grundfarbe (CSS-String oder Picker):
    <div class="controls-color">
      <input id="color-input" type="text" name="baseColorText" value="#18fbf8" />
      <input id="color-picker" aria-label="testcolorpicker" type="color" name="baseColorPicker" value="#18fbf8" />
    </div>
  </label>

  <label class="row">
    Vorschautext:
    <input id="preview-text" type="text" name="previewText" value="Beispieltext für Barrierefreiheit" />
  </label>

  <label for="font-select">Schriftart:</label>
  <select name="fontFamily" id="font-select">
    <option value="system-ui, sans-serif">System UI (Standard)</option>
    <option value="'Inter', sans-serif">Inter</option>
    <option value="'Fira Code', monospace">Fira Code (Monospace)</option>
    <option value="Georgia, serif">Georgia (Serif)</option>
    <option value="'Courier New', monospace">Courier New</option>
  </select>

  <label for="hue-slider" >
    Farbton-Winkel (Hue): <span id="hue-value">140</span>°
  </label>
  <div class="container-slider colored" >
    <input class="colored" id="hue-slider" type="range" name="hue" min="0" max="360" value="140" />
  </div>
  <label for="sat-slider">
    Farbsättigung (Sat): <span id="sat-value">50%</span>
  </label>
  <div class="container-slider gray" >
    <input id="sat-slider" type="range" name="sat" min="0" max="1" step="0.01" value="0.5" />
  </div>
  </form>
`;



export class HTMLColorControl extends HTMLElement {
  #root = this.attachShadow({ mode: "closed" })

  /**
   * Description placeholder
   *
   * @type {HTMLElement|HTMLSpanElement}
   */
  // @ts-ignore
  #hueValueDisplay

  /**
   * Description placeholder
   *
   * @type {HTMLElement|HTMLSpanElement}
   */
  // @ts-ignore
  #satValueDisplay

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
   */
  // @ts-ignore
  #hueSlider

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
   */
  // @ts-ignore
  #satSlider

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
   */
  // @ts-ignore
  #colorInput

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
  */
  // @ts-ignore
  #colorPicker

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
  */
  // @ts-ignore

  #previewText
  /** @type {HTMLSelectElement} */
  // @ts-ignore
  #fontFamily

  /**
   * Description placeholder
   *
   * @type {OnChangeDetail}
   */
  #changeDetail = {
    hue: {
      old: null,
      new: null
    },
    sat: {
      old: null,
      new: null
    },
    color: {
      old: null,
      new: null
    },
    font: {
      old: null,
      new: null
    },
    text: {
      old: null,
      new: null
    },
    eventsource: ControlEventType.INITIAL
  }

  /**
   * Description placeholder
   *
   * @type {Array<string>}
   */
  #connectedCardIds = []

  /**
   * 
   *
   * @type {Array<HTMLA11yColorCard>}
   */
  #connectedCards = []



  /**
   * Creates an instance of HTMLColorControl.
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
      /** 
       * 'for' a list of ids of HTMLA11yColorCards elements
       * to collect them and connect ist to the control.
       * Attention not implemented yet.
       */
      "for"
    ];
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */

  connectedCallback() {
    console.log('Element connected')

    this.#hueValueDisplay =  /** @type {HTMLSpanElement} */(this.#root.getElementById("hue-value"))
    this.#satValueDisplay = /** @type {HTMLSpanElement} */(this.#root.getElementById("sat-value"))
    this.#hueSlider = /** @type {HTMLInputElement} */(this.#root.getElementById("hue-slider"))
    this.#satSlider = /** @type {HTMLInputElement} */(this.#root.getElementById("sat-slider"))
    this.#colorInput = /** @type {HTMLInputElement} */(this.#root.getElementById("color-input"))
    this.#colorPicker =/** @type {HTMLInputElement} */ (this.#root.getElementById("color-picker"))
    this.#previewText = /** @type {HTMLInputElement} */ (this.#root.getElementById("preview-text"))
    this.#fontFamily = /** @type {HTMLSelectElement} */ (this.#root.getElementById("font-select"))
    this.#hueSlider.addEventListener("input", this.#onHueInput)
    this.#satSlider.addEventListener("input", this.#onSatInput)
    this.#colorInput.addEventListener("change", this.#onColorInputChange)
    this.#colorPicker.addEventListener("change", this.#onColorPickerChange)
    this.#previewText.addEventListener("change", this.#onPreviewTextChange)
    this.#fontFamily.addEventListener("change", this.#onFontFamilyChange)

    const fonts = getSortedFontListWithKey()
    populateFontSelect(this.#fontFamily, fonts)



    this.#initialize()
    window.addEventListener("load", () => {
      // Initiale Werte abgreifen (z. B. aus den Default-Werten der Inputs)
      this.#collectCards()
      this.#dispatchChangeEvent()
    }, { once: true });

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
   * @param {string|null} name - Name of the attribute.
   * @param {string|null} oldValue - The old value of the attribute.
   * @param {string|null} newValue - The new, current value of the attribute.
  */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Name:', name, ' Values: old:', oldValue, ' new:', newValue)
    if (oldValue == newValue) {
      return
    }
    switch (name) {
      case "for":
        if (newValue)
          this.#connectedCardIds = newValue.split(/[,;\s]+/);
        if (this.isConnected)
          this.#collectCards()

        break;

      default:
        break;
    }
  }

  #initialize() {
    this.#changeDetail.hue.new = this.#hueSlider.value
    this.#changeDetail.color.new = this.#colorInput.value
    this.#changeDetail.sat.new = this.#satSlider.value
    this.#changeDetail.text.new = this.#previewText.value
    this.#changeDetail.font.new = this.#fontFamily.value
  }

  #collectCards() {
    this.#connectedCards = []
    this.#connectedCardIds.forEach(item => {
      const a11ycard = document.getElementById(item)

      if (a11ycard instanceof HTMLA11yColorCard) {
        this.#connectedCards.push(a11ycard)
      }
    })
  }

  /**
   * Feuert das konfigurierte Event nach außen.
   *
   */
  #dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent("config-change", {
      detail: this.#changeDetail,
      bubbles: true,
      composed: true
    }));
    this.#updateConnectedCards()
  }
  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onFontFamilyChange = (event) => {
    const target = /** @type {HTMLSelectElement} */ (event.target);
    console.log(target)
    this.#changeDetail.font.old = this.#changeDetail.font.new
    this.#changeDetail.font.new = target.value
    this.#changeDetail.eventsource = ControlEventType.FONT_FAMILY
    this.#dispatchChangeEvent()
  }


  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onPreviewTextChange = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    this.#changeDetail.text.old = this.#changeDetail.text.new
    this.#changeDetail.text.new = target.value
    this.#changeDetail.eventsource = ControlEventType.PREVIEW_TEXT
    this.#dispatchChangeEvent()
  }

  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onHueInput = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    this.#hueValueDisplay.textContent = target.value
    this.#changeDetail.hue.old = this.#changeDetail.hue.new
    this.#changeDetail.hue.new = target.value
    this.#changeDetail.eventsource = ControlEventType.HUE


    this.#dispatchChangeEvent()
  }
  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onSatInput = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    this.#satValueDisplay.textContent = `${(parseFloat(target.value) * 100).toFixed(1)} %`
    this.#changeDetail.sat.old = this.#changeDetail.sat.new
    this.#changeDetail.sat.new = target.value
    this.#changeDetail.eventsource = ControlEventType.SATURATION

    this.#dispatchChangeEvent()
  }

  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onColorInputChange = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    const value = target.value
    if (this.#colorPicker.value == value) return
    this.#colorPicker.value = value
    this.#changeDetail.color.old = this.#changeDetail.color.new
    this.#changeDetail.color.new = value
    this.#changeDetail.eventsource = ControlEventType.BASE_COLOR

    this.#dispatchChangeEvent()
  }
  /**
   * Description placeholder
   *
   * @param {Event} event 
   */

  #onColorPickerChange = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    const value = target.value
    console.log("Picker", value)
    if (this.#colorInput.value == value) return
    this.#colorInput.value = value
    const colorHsl = hsl(value)
    this.#hueSlider.value = colorHsl.h
    this.#hueValueDisplay.textContent = this.#hueSlider.value
    this.#satSlider.value = colorHsl.s

    /**
     * Description placeholder
     *
     * @type {number}
     */
    const satDisp = parseFloat(this.#satSlider.value) * 100
    this.#satValueDisplay.textContent = `${satDisp.toFixed(1)} %`
    this.#changeDetail.color.old = this.#changeDetail.color.new
    this.#changeDetail.color.new = value
    this.#changeDetail.eventsource = ControlEventType.BASE_COLOR
    this.#dispatchChangeEvent()
  }

  #updateConnectedCards() {
    const detail = this.#changeDetail
    // console.log(e.detail)
    if (detail.eventsource == ControlEventType.INITIAL) {
      console.log("Initial")
    }
    const esrc = detail.eventsource
    const typ = ControlEventType

    this.#connectedCards.forEach((item) => {
      if (esrc == typ.HUE) {
        const newHue = /** @type {string} */(detail.hue.new)
        item.hue = newHue
        return

      }
      if (esrc == typ.SATURATION) {
        const newSat = /** @type {string} */(detail.sat.new)
        item.sat = newSat
        return
      }


      if (esrc == typ.BASE_COLOR || esrc == typ.INITIAL) {
        const newColor = /** @type {string} */(detail.color.new)
        item.curColor = new ColorContrastPairs(newColor)
        // item.updateUI()
      }
      if (esrc == typ.PREVIEW_TEXT || esrc == typ.INITIAL) {
        const newText = /** @type {string} */(detail.text.new)
        // console.log(newText)
        item.exampleText = newText


      }
      if (esrc == typ.FONT_FAMILY || esrc == typ.INITIAL) {
        const newfont = /** @type {string} */(detail.font.new)
        // console.log(JSON.parse(newfont))
        item.previewFont = newfont

      }



    })

  }
}







