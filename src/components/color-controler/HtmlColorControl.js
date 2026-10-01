/** 
 * @packageDocumentation
 * 
 * ## Abstract
 * 
 * A color controller component that allows users to interactively pick and adjust base colors,
 * hues, saturation, font styles, and preview texts.
 *
 * ## Architecture & Usage 
 *
 * ### Target Binding (`for` attribute)
 * The control can be linked to target elements or cards using its `for` attribute.
 * **"This Controller is for: [Target-ID]"** — by specifying the ID of a target 
 * {@link HTMLA11yColorCard},
 * the controller automatically synchronizes and dispatches state updates to that element.
 *
 * ### Custom Events
 * Dispatches the`config-change` custom event ({@link ConfigChangeEvent}) to notify listeners about changes
 * in the element. Its `detail` attribute has {@link OnChangeDetail} interface.
 *
 * 
 */

//@ts-check

import {
  hsl,
  // } from "../node_modules/culori/bundled/culori.mjs";
} from "culori";
import { ColorContrastPairs } from "../../utils/ColorContrastPair.js";

import { getSortedFontListWithKey, populateFontSelect } from "../../utils/get-fonts.js";
import { HTMLA11yColorCard } from "../color-card/HtmlA11yColorCard.js";

// @ts-ignore
import modulecss from '../components.css?inline' with { type: 'css' };
// @ts-ignore
// import modulcss from './HtmlColorControl.css?inline' with { type: 'css' };


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
 * @enum {string}
 * Defines the types of control events dispatched by the color controller component.
 * 
 */
export const ControlEventEnum = Object.freeze({
  /** Triggered when the controller is initially loaded or reset. */
  INITIAL: "initial",
  /** Triggered when the base color is modified. */
  BASE_COLOR: "base-color",
  /** Triggered when the preview text content changes. */
  PREVIEW_TEXT: "preview-text",
  /** Triggered when the active font family is updated. */
  FONT_FAMILY: "font-family",
  /** Triggered when the hue slider value changes. */
  HUE: "hue",
  /** Triggered when the saturation slider value changes. */
  SATURATION: "saturation"
});

// const ControlEventEnum=0;

/**
 * @typedef {ControlEventEnum[keyof ControlEventEnum]} ControlEventType
 * An Alias for the entries of enum ControlEventType 
 */

/**
 * @typedef {object} ChangedData - Data object of changed data
 * @property {string|null} old - The value before the change
 * @property {string|null} new - The value to which changed
 */


/**
 * 
 * @typedef {object} OnChangeDetail Details payload dispatched with change events from the color controller.
 * @property {ChangedData} hue Hue component change details.
 * @property {ChangedData} sat Saturation component change details.
 * @property {ChangedData} font Font family change details.
 * @property {ChangedData} text Preview text change details.
 * @property {ChangedData} color Base color change details.
 * @property {ControlEventEnum} eventsource The source event type that triggered the change.
 */



/**
 * Event for config of {@link HTMLColorControl} changed.
 *
 * @event
 * @extends {Event}
 */
export class ConfigChangeEvent extends Event {

  /**
   * @type {OnChangeDetail} detail
   */
  #detail;
  /**
   * @param {OnChangeDetail} detail - The change event details.
   */
  constructor(detail) {
    super('config-change', {
      bubbles: true,
      composed: true, // Wichtig, wenn das Event aus dem Shadow DOM heraus bubbled!
      cancelable: true
    });
    this.#detail = detail;
  }

  /**
   * Get all properties of the {@link HTMLColorControl} 
   *  with old and new values.
   * 
   * @returns {OnChangeDetail} The change event details.
   */
  get detail() {
    return this.#detail;
  }

}






const template =/*html*/`
<form class="test-card"id="control-form">
  <label class="row">
  Base color (CSS string or picker):
    <div class="controls-color">
      <input id="color-input" type="text" name="baseColorText" value="#18fbf8" />
      <input id="color-picker" aria-label="testcolorpicker" type="color" name="baseColorPicker" value="#18fbf8" />
    </div>
  </label>

  <label class="row">
  Preview text:
    <input id="preview-text" type="text" name="previewText" value="Accessibility sample text" />
  </label>

  <label for="font-select">Font family:</label>
  <select name="fontFamily" id="font-select">
    <option value="system-ui, sans-serif">System UI (Default)</option>
    <option value="'Inter', sans-serif">Inter</option>
    <option value="'Fira Code', monospace">Fira Code (Monospace)</option>
    <option value="Georgia, serif">Georgia (Serif)</option>
    <option value="'Courier New', monospace">Courier New</option>
  </select>

  <label for="hue-slider" >
  Hue angle: <span id="hue-value">140</span>°
  </label>
  <div class="container-slider colored" >
    <input class="colored" id="hue-slider" type="range" name="hue" min="0" max="360" value="140" />
  </div>
  <label for="sat-slider">
  Saturation: <span id="sat-value">50%</span>
  </label>
  <div class="container-slider gray" >
    <input id="sat-slider" type="range" name="sat" min="0" max="1" step="0.01" value="0.5" />
  </div>
  </form>
`;


/**
 * A color controller component that allows users to interactively pick and adjust colors.
 * 
 * ## Target Binding (`for` attribute)
 * **This Controller is for:** [Target-ID] — by specifying the ID of a target 
 * {@link HTMLA11yColorCard}
 * via the `for` attribute, the controller automatically synchronizes state updates.
 * 
 ***Dispatches**:
 *>  {@link ConfigChangeEvent}: Every time an attribute changed, interactive or programmatically.
 *
 * @class 
 * @extends {HTMLElement}
  */
export class HTMLColorControl extends HTMLElement {
  #root = this.attachShadow({ mode: "closed" });

  /**
   * Description placeholder
   *
   * @type {HTMLElement|HTMLSpanElement}
   */
  // @ts-ignore
  #hueValueDisplay;

  /**
   * Description placeholder
   *
   * @type {HTMLElement|HTMLSpanElement}
   */
  // @ts-ignore
  #satValueDisplay;

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
   */
  // @ts-ignore
  #hueSlider;

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
   */
  // @ts-ignore
  #satSlider;

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
   */
  // @ts-ignore
  #colorInput;

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
  */
  // @ts-ignore
  #colorPicker;

  /**
   * Description placeholder
   *
   * @type {HTMLInputElement}
  */
  // @ts-ignore
  #previewText;

  /** @type {HTMLSelectElement} */
  // @ts-ignore
  #fontFamily;

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
    eventsource: ControlEventEnum.INITIAL
  };



  /**
   * Map
   *
   * @type {Map<string,HTMLA11yColorCard|null>}
   */
  #connectedCards = new Map();


  /**
   * Creates an instance of HTMLColorControl.
  */
  constructor() {
    super();
    this.#root.adoptedStyleSheets = [moduleStyleSheet];
    this.#root.innerHTML = template;
    this.#hueValueDisplay =  /** @type {HTMLSpanElement} */(this.#root.getElementById("hue-value"));
    this.#satValueDisplay = /** @type {HTMLSpanElement} */(this.#root.getElementById("sat-value"));
    this.#hueSlider = /** @type {HTMLInputElement} */(this.#root.getElementById("hue-slider"));
    this.#satSlider = /** @type {HTMLInputElement} */(this.#root.getElementById("sat-slider"));
    this.#colorInput = /** @type {HTMLInputElement} */(this.#root.getElementById("color-input"));
    this.#colorPicker =/** @type {HTMLInputElement} */ (this.#root.getElementById("color-picker"));
    this.#previewText = /** @type {HTMLInputElement} */ (this.#root.getElementById("preview-text"));
    this.#fontFamily = /** @type {HTMLSelectElement} */ (this.#root.getElementById("font-select"));
    this.#hueSlider.addEventListener("input", this.#onHueInput);
    this.#satSlider.addEventListener("input", this.#onSatInput);
    this.#colorInput.addEventListener("change", this.#onColorInputChangeEvent);
    this.#colorPicker.addEventListener("change", this.#onColorPickerChange);
    this.#previewText.addEventListener("change", this.#onPreviewTextChangeEvent);
    this.#fontFamily.addEventListener("change", this.#onFontFamilyChange);

  }

  /**
   * Defines the attributes that should trigger attributeChangedCallback when modified.
   * 
   * @type {string[]}
   * @internal
  */
  static get observedAttributes() {
    return [
      /** 
       * 'for' a list of ids of HTMLA11yColorCards elements
       * to collect them and connect ist to the control.
       */
      "for",
      "initial-color",
      "initial-preview-text",
    ];
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   * @internal
   */
  connectedCallback() {
    const docfonts = document.fonts;

    let fonts;
    if (docfonts)
      fonts = getSortedFontListWithKey(docfonts);
    else
      fonts = getSortedFontListWithKey([]);
    populateFontSelect(this.#fontFamily, fonts);



    this.#initialize();
    /* c8 ignore else */
    if (document.readyState === 'complete') {
      // Dokument ist bereits da -> direkt initialisieren
      queueMicrotask(() => {
        this.#collectCards();
      });
      this.#dispatchChangeEvent();

    } else {
      window.addEventListener("load", () => {
        queueMicrotask(() => {
          this.#collectCards();
        });
        this.#dispatchChangeEvent();

      }, { once: true });
    }
  }


  /**
   * Invoked each time one of the element's observed attributes is added, removed, or changed.
   *
   * @param {string|null} name - Name of the attribute.
   * @param {string|null} oldValue - The old value of the attribute.
   * @param {string|null} newValue - The new, current value of the attribute.
   * @internal
  */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) {
      return;
    }
    switch (name) {
      case "initial-color":
        if (!newValue) return;
        this.color = newValue;
        break;

      case "initial-preview-text":
        if (!newValue) return;
        this.previewText = newValue;
        break;

      case "for":
        if (newValue) {
          newValue.split(/[,;\s]+/).forEach((item) => {
            this.#connectedCards.set(item, null);
          });
        }
        if (this.isConnected)
          this.#collectCards();

        break;
      /* c8 ignore next */
      default:
        console.warn(`Unhandled HTML attribut: ${name}`.trim());
        break;
    }
  }

  /**
   * Get the color of the controler.
   *
   * @type {string}
   */
  get color() {
    return this.#colorInput.value;
  }
  /**
   * Set the color of the controler.
   *
   * @type {string}
   */
  set color(value) {
    this.#colorInput.value = value;
    this.#onColorInputChange(value);
  }

  /**
   * Get the preview text of the cdotroler.
   *
   * @type {string}
   */
  get previewText() {
    return this.#previewText.value;
  }
  /**
   * Set the preview text of the cdotroler.
   *
   * @type {string}
   */
  set previewText(value) {
    this.#previewText.value = value;
    this.#onPreviewTextChange(value);
  }


  /**
   * Add card to controller
   *
   * @param {string} cardId An ID of a {@link HTMLA11yColorCard}
   */
  addCard(cardId) {
    if (cardId) {
      if (!this.#connectedCards.has(cardId))
        this.#connectedCards.set(cardId, null);
    }
    this.#collectCards();
  }
  /**
   * Remove a card from controller
   *
   * @param {string} cardId An ID of a {@link HTMLA11yColorCard}
   */
  removeCard(cardId) {
    if (cardId && this.#connectedCards.has(cardId))
      this.#connectedCards.delete(cardId);
  }
  /**
   * Returns a map representing card IDs and their active state.
   * 
   * Active state is `true` if a {@link HTMLA11yColorCard} with the ID is attached to the
   * contoller, else `false`.
   * @returns {Map<string, boolean>}
   */
  getCardStatuses() {
    return new Map(
      Array.from(this.#connectedCards.entries(), ([id, card]) => [id, card !== null])
    );
  }

  #initialize() {
    this.#changeDetail.hue.new = this.#hueSlider.value;
    this.#changeDetail.color.new = this.#colorInput.value;
    this.#changeDetail.sat.new = this.#satSlider.value;
    this.#changeDetail.text.new = this.#previewText.value;
    this.#changeDetail.font.new = this.#fontFamily.value;
  }

  #collectCards() {
    this.#connectedCards.forEach((_, key) => {
      const a11ycard = document.getElementById(key);
      if (a11ycard instanceof HTMLA11yColorCard) {
        this.#connectedCards.set(key, a11ycard);
      } else if (!(a11ycard === undefined || a11ycard === null)) {
        this.#connectedCards.delete(key);
      }
    });
    this.#updateConnectedCards();
  }

  /**
   * Feuert das konfigurierte Event nach außen.
   *
   */
  #dispatchChangeEvent() {
    this.dispatchEvent(new ConfigChangeEvent(this.#changeDetail));
    this.#updateConnectedCards();
    // #if !PROD
    this.test_dispathChangeEvent();
    // #endif
  }
  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onFontFamilyChange = (event) => {
    const target = /** @type {HTMLSelectElement} */ (event.target);
    this.#changeDetail.font.old = this.#changeDetail.font.new;
    this.#changeDetail.font.new = target.value;
    this.#changeDetail.eventsource = ControlEventEnum.FONT_FAMILY;
    this.#dispatchChangeEvent();
  };


  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onPreviewTextChangeEvent = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    this.#onPreviewTextChange(target.value);
  };

  /**
   * Description placeholder
   *
   * @param {string} text 
   */
  #onPreviewTextChange = (text) => {
    this.#changeDetail.text.old = this.#changeDetail.text.new;
    this.#changeDetail.text.new = text;
    this.#changeDetail.eventsource = ControlEventEnum.PREVIEW_TEXT;
    this.#dispatchChangeEvent();
  };


  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onHueInput = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    this.#hueValueDisplay.textContent = target.value;
    this.#changeDetail.hue.old = this.#changeDetail.hue.new;
    this.#changeDetail.hue.new = target.value;
    this.#changeDetail.eventsource = ControlEventEnum.HUE;


    this.#dispatchChangeEvent();
  };
  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onSatInput = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    this.#satValueDisplay.textContent = `${(parseFloat(target.value) * 100).toFixed(1)} %`;
    this.#changeDetail.sat.old = this.#changeDetail.sat.new;
    this.#changeDetail.sat.new = target.value;
    this.#changeDetail.eventsource = ControlEventEnum.SATURATION;

    this.#dispatchChangeEvent();
  };

  /**
   * Description placeholder
   *
   * @param {Event} event 
   */
  #onColorInputChangeEvent = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    const value = target.value;
    this.#onColorInputChange(value);
  };

  /**
   * Description placeholder
   *
   * @param {string} color 
   */
  #onColorInputChange(color) {
    if (this.#colorPicker.value == color) return;
    this.#colorPicker.value = color;
    this.#changeDetail.color.old = this.#changeDetail.color.new;
    this.#changeDetail.color.new = color;
    this.#changeDetail.eventsource = ControlEventEnum.BASE_COLOR;

    this.#dispatchChangeEvent();
  }
  /**
   * Description placeholder
   *
   * @param {Event} event 
   */

  #onColorPickerChange = (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    const value = target.value;
    if (this.#colorInput.value == value) return;
    this.#colorInput.value = value;
    const colorHsl = /** @type {import("culori").Hsl} */(hsl(value));
    this.#hueSlider.value = `${colorHsl.h}`.trim();
    this.#hueValueDisplay.textContent = this.#hueSlider.value;
    this.#satSlider.value = `${colorHsl.s}`.trim();

    /**
     * Description placeholder
     *
     * @type {number}
     */
    const satDisp = parseFloat(this.#satSlider.value) * 100;
    this.#satValueDisplay.textContent = `${satDisp.toFixed(1)} %`;
    this.#changeDetail.color.old = this.#changeDetail.color.new;
    this.#changeDetail.color.new = value;
    this.#changeDetail.eventsource = ControlEventEnum.BASE_COLOR;
    this.#dispatchChangeEvent();
  };

  #updateConnectedCards() {
    const detail = this.#changeDetail;
    const esrc = detail.eventsource;
    const typ = ControlEventEnum;
    /** @type {Array<HTMLA11yColorCard>} */
    const cards = /** @type {Array<HTMLA11yColorCard>} */([...this.#connectedCards.entries()]
      .filter((item) => { return item[1] !== null; })
      .map((item) => { return item[1]; }));
    cards.forEach((item) => {
      if (esrc == typ.HUE || esrc == typ.INITIAL) {
        const newHue = /** @type {string} */(detail.hue.new);
        if (newHue) {
          item.hue = parseFloat(newHue);
          // console.log("newHue", newHue, item.hue);
        }
      }
      if (esrc == typ.SATURATION || esrc == typ.INITIAL) {
        const newSat = /** @type {string} */(detail.sat.new);
        if (newSat)
          item.sat = parseFloat(newSat);
      }
      if (esrc == typ.HUE || esrc == typ.SATURATION)
        return;

      if (esrc == typ.BASE_COLOR || esrc == typ.INITIAL) {
        const newColor = /** @type {string} */(detail.color.new);
        if (newColor) {
          // console.log(newColor);
          item.curColor = new ColorContrastPairs(newColor);
        }
        // item.updateUI()
      }
      if (esrc == typ.PREVIEW_TEXT || esrc == typ.INITIAL) {
        const newText = /** @type {string} */(detail.text.new);
        // console.log(newText)
        if (newText)
          item.exampleText = newText;


      }
      if (esrc == typ.FONT_FAMILY || esrc == typ.INITIAL) {
        const newfont = /** @type {string} */(detail.font.new);
        // console.log(JSON.parse(newfont))
        if (newfont) {
          item.previewFont = newfont;
        };
      }
    });

  }
  // #if !PROD
  /* c8 ignore start */
  /**
 * @showGroups
 * @module
 */

  /**
   * @group Testing
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
  get test_hueSlider() {
    return this.#hueSlider;
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @type {HTMLSpanElement}
   */
  get test_hueValueDisplay() {
    return this.#hueValueDisplay;
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @type {HTMLInputElement}
   */
  get test_satSlider() {
    return this.#satSlider;
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @type {HTMLSpanElement}
   */
  get test_satValueDisplay() {
    return this.#satValueDisplay;
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @type {HTMLInputElement}
   */
  get test_colorInput() {
    return this.#colorInput;
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @type {HTMLInputElement}
   */
  get test_colorPicker() {
    return this.#colorPicker;
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @type {HTMLInputElement}
   */
  get test_previewText() {
    return this.#previewText;
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @type {HTMLSelectElement}
   */
  get test_fontFamily() {
    return this.#fontFamily;
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @type {Array<string>}
   */
  get test_connectedCardIds() {
    return [...this.#connectedCards.keys()];
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @type {OnChangeDetail}
   */
  get test_changeDetail() {
    return this.#changeDetail;
  }

  /** 
   * 
  * @group Testing
  */
  test_dispathChangeEvent() {
  }

  /**
   * Description placeholder
   *
  * @group Testing
  * @param {OnChangeDetail} changeDetail 
   */
  test_nullNewBranchesUpdateConnectedCards(changeDetail) {
    this.#changeDetail = changeDetail;
    // console.log(this.#changeDetail);
    this.#updateConnectedCards();
  };
  /* c8 ignore stop */
  // #endif

}







