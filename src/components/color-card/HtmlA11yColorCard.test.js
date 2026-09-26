// @ts-check

import { describe, it, expect, beforeEach, afterEach, vi, test } from 'vitest';
import { HTMLA11yColorCard } from "./HtmlA11yColorCard.js";
import { ColorContrastPairs } from "../../utils/ColorContrastPair.js";


if (!customElements.get('html-color-card')) {
  customElements.define('html-color-card', HTMLA11yColorCard);
}

describe('HtmlA11yColorCard', () => {
  /** @type {HTMLA11yColorCard} */
  let element;

  beforeEach(() => {
    // Create a fresh instance before each test
    element = /** @type {HTMLA11yColorCard} */(document.createElement('html-color-card'));
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up the DOM after each test
    element.remove();
  });

  it('should instantiate successfully and provide the test hook', () => {
    expect(element).toBeDefined();
    // Access the private test hook
    expect(typeof element.test_set_new_lum).toBe('function');

    // Example: Once you expose private getters/setters via _vitest(),
    // you can test them right here:
    // expect(testHook.somePrivateMethod()).toBe(...);
  });
  it('should check if color is valid color', () => {
    document.body.innerHTML = /*html*/`
    		<html-color-card mode="darker"></html-color-card>
    	`;

    // const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
    let validColor = element.isLegalColor("#ffffff");
    expect(validColor).toBeDefined();
    expect(validColor).toBe(false);
    element.setAttribute("mode", "lighter");
    validColor = element.isLegalColor("#000000");
    expect(validColor).toBe(false);
  });

});

describe('HTMLA11yColorCard via HTML tag and attributes', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should instantiate successfully from a pure HTML string without attributes', () => {
    document.body.innerHTML = `
			<html-color-card></html-color-card>
		`;

    const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));

    expect(element).toBeDefined();
    expect(element instanceof HTMLA11yColorCard).toBe(true);
  });
  describe('HTML attribute handling', () => {
    it('should parse the not used "color" attribute when provided in the HTML string', () => {
      document.body.innerHTML = `
			<html-color-card color="#ff0000"></html-color-card>
		`;

      const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));

      expect(element.hasAttribute('color')).toBe(true);
      expect(element.getAttribute('color')).toBe('#ff0000');
      expect(/** @type {ColorContrastPairs} */(element.curColor).originalColor).toBe("#18fbf8");
    });
    it('should correctly apply the "initial-color" attribute when provided in the HTML string', () => {
      document.body.innerHTML = `
			<html-color-card initial-color="#ff0000"></html-color-card>
		`;

      const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));

      expect(element.hasAttribute('initial-color')).toBe(true);
      expect(element.getAttribute('initial-color')).toBe('#ff0000');
      expect(/** @type {ColorContrastPairs} */(element.curColor).originalColor).toBe('#ff0000');
    });
    it('should correctly handle "font-mode" attribute', () => {
      document.body.innerHTML = `
				<html-color-card font-mode="bold"></html-color-card>
			`;
      const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));

      expect(element.getAttribute('font-mode')).toBe('bold');
      expect(element.fontMode).toBe('bold'); // Angenommener Getter-Name
    });

    it('should fall back correctly on unsupported "font-mode"', () => {
      document.body.innerHTML = `
				<html-color-card font-mode="invalid-mode"></html-color-card>
			`;
      const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));

      expect(element.getAttribute('font-mode')).toBe('invalid-mode');
      expect(element.fontMode).toBe('normal');
      // Interne Validierung greift und behält den Standard-Wert bei
    });

    it('should correctly handle "mode" attribute', () => {
      document.body.innerHTML = `
				<html-color-card mode="lighter"></html-color-card>
			`;
      const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));

      expect(element.getAttribute('mode')).toBe('lighter');
      expect(element.mode).toBe('lighter');
    });

    it('should correctly handle "wcag-mode" attribute', () => {
      document.body.innerHTML = `
				<html-color-card wcag-mode="AAA"></html-color-card>
			`;
      const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));

      expect(element.getAttribute('wcag-mode')).toBe('AAA');
      expect(element.wcagMode).toBe('AAA'); // Angenommener Getter-Name
    });
  });
  it("should handle combinated attributes", () => {
    document.body.innerHTML = `
    <html-color-card initial-color font-mode="large" wcag-mode="AAA"></html-color-card>
  `;
    const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
    expect(element.getAttribute('font-mode')).toBe('large');
    expect(element.fontMode).toBe('large'); // Angenommener Getter-Name
    expect(element.getAttribute('wcag-mode')).toBe('AAA');
    expect(element.wcagMode).toBe('AAA'); // Angenommener Getter-Name
  });
  it("should handle imposible combination of attributes", () => {
    document.body.innerHTML = `
    <html-color-card initial-color="#0000" mode="darker"></html-color-card>
  `;
    const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
    expect(element.hasAttribute('initial-color')).toBe(true);
    expect(element.getAttribute('initial-color')).toBe('#0000');
    expect(element.getAttribute('mode')).toBe('darker');
    expect(element.mode).toBe('darker');

  });
  it("should handle empty attributes", () => {
    document.body.innerHTML = `
				<html-color-card initial-color font-mode="" mode="" wcag-mode=""></html-color-card>
			`;
    const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
    expect(element.hasAttribute('initial-color')).toBe(true);
    expect(element.getAttribute('initial-color')).toBe('');
  });

});
describe('Public JavaScript API and programmatic usage', () => {
  /** @type {HTMLA11yColorCard} */
  let element;

  beforeEach(() => {
    document.body.innerHTML = '';
    element = /** @type {HTMLA11yColorCard} */ (document.createElement('html-color-card'));
    document.body.appendChild(element);
  });

  it('should allow programmatic interaction via the JS API', () => {
    // Hier testen wir die programmatischen Aufrufe und Methoden der JS-API
    expect(element).toBeDefined();
  });
  it('should update current color programmatically via JS property setter', () => {
    element.curColor = '#ff0000';
    expect(element.curColor instanceof ColorContrastPairs).toBeTruthy();
    expect(element.curColor.originalColor).toBe('#ff0000');
  });
  it('should set the preview example Text correctly', () => {
    element.exampleText = 'Sample Text';
    expect(element.exampleText).toBe('Sample Text');
  });
  it('should set the hue correctly', () => {
    element.hue = 180;
    expect(element.hue).toBe(180);
    // expect(()=>{
    //   element.hue = 180;
    // }).toThrow("No color or/and background color found.")
  });
  it('should set the saturation (sat) correctly', () => {
    element.sat = 0.5;
    expect(element.sat).toBe(0.5);
  });
  it('should set the preview example Font correctly', () => {
    element.previewFont = JSON.stringify({ family: 'Fira Sans', style: 'italic' });
    expect(element.previewFont).toEqual('{"family":"Fira Sans","style":"italic"}');
  });
  it('should dispatch current-color-changed event on update and guard against identical values', () => {
    const listener = vi.fn();
    element.addEventListener('current-color-changed', listener);

    // 1. Initial change with new value
    element.curColor = "#ff0000";
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toHaveProperty('newValue', "#ff0000");

    // 2. Setting identical value should be blocked by guard
    element.curColor = "#ff0000";
    expect(listener).toHaveBeenCalledTimes(1);

    element.curColor = new ColorContrastPairs("#ff0000");
    expect(listener).toHaveBeenCalledTimes(1);

  });
  it('should dispatch example-text-changed event on update and guard against identical values', () => {
    const listener = vi.fn();
    element.addEventListener('example-text-changed', listener);

    // 1. Initial change with new value
    element.exampleText = "Hallo World.";
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toHaveProperty("newValue", "Hallo World.");

    // 2. Setting identical value should be blocked by guard
    element.exampleText = "Hallo World.";
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it('should dispatch hue-changed event on update and guard against identical values', () => {
    const listener = vi.fn();
    element.addEventListener('hue-changed', listener);

    // 1. Initial change with new value
    element.hue = 275;
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toHaveProperty("newValue", 275);

    // 2. Setting identical value should be blocked by guard
    element.hue = 275;
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it('should dispatch saturation-changed event on update and guard against identical values', () => {
    const listener = vi.fn();
    element.addEventListener('saturation-changed', listener);

    // 1. Initial change with new value
    element.sat = 0.6;
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toHaveProperty("newValue", 0.6);

    // 2. Setting identical value should be blocked by guard
    element.sat = 0.6;
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it('should dispatch font-changed event on update and guard against identical values', () => {
    const listener = vi.fn();
    element.addEventListener('font-changed', listener);

    // 1. Initial change with new value
    element.previewFont = '{"family":"Fira Sans","style":"italic"}';
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toHaveProperty("newValue", '{"family":"Fira Sans","style":"italic"}');

    // 2. Setting identical value should be blocked by guard
    element.previewFont = '{"family":"Fira Sans","style":"italic"}';
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it('should dispatch color-mode-changed event on update and guard against identical values', () => {
    const listener = vi.fn();
    element.addEventListener('color-mode-changed', listener);

    // 1. Initial change with new value
    element.setAttribute("mode", "lighter");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toHaveProperty("newValue", "lighter");

    // 2. Setting identical value should be blocked by guard
    element.setAttribute("mode", "lighter");
    expect(listener).toHaveBeenCalledTimes(1);
    // 3. Setting wrong value should be blocked by guard
    element.setAttribute("mode", "brighter");
    expect(listener).toHaveBeenCalledTimes(1);

  });
  it('should dispatch font-mode-changed event on update and guard against identical values', () => {
    const listener = vi.fn();
    element.addEventListener('font-mode-changed', listener);

    // 1. Initial change with new value
    element.setAttribute("font-mode", "bold");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toHaveProperty("newValue", "bold");

    // 2. Setting identical value should be blocked by guard
    element.setAttribute("font-mode", "bold");
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it('should dispatch wcga-mode-changed event on update and guard against identical values', () => {
    const listener = vi.fn();
    element.addEventListener('wcga-mode-changed', listener);

    // 1. Initial change with new value
    element.setAttribute("wcag-mode", "AAA");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toHaveProperty("newValue", "AAA");

    // 2. Setting identical value should be blocked by guard
    element.setAttribute("wcag-mode", "AAA");
    expect(listener).toHaveBeenCalledTimes(1);
    // 3. Setting wrong value should be blocked by guard
    element.setAttribute("wcag-mode", "A");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  describe("The API for the lumincense slider provided by the component", () => {
    it("checks if the disabled property is true if impossible combination is used", () => {
      document.body.innerHTML = /*html*/`
        <html-color-card initial-color="#000000"></html-color-card>
      `;
      element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));

      expect(element).toBeDefined();
      expect(element.test_slider.disabled).toBeTruthy();
    });
    it("checks if the disabled property is false if proper combination is used", () => {
      element.curColor = "#ffffff";
      expect(element.test_slider.disabled).toBeFalsy();
    });
    it("set the value of the slider und looks if the the event is not dispatched if disabled", () => {
      const listener = vi.fn();
      element.addEventListener('input', listener);
      element.luminescenceSliderValue = "0.5";
      expect(listener).toHaveBeenCalledTimes(0);
    });
    it("set the value of the slider and looks if the the event is dispatched if not disabled", () => {
      const listener = vi.fn();
      element.curColor = "#ffffff";
      expect(parseFloat(element.luminescenceSliderMax)).toBeGreaterThanOrEqual(0.4);
      expect(parseFloat(element.luminescenceSliderMin)).toBeLessThanOrEqual(0.4);
      element.addEventListener('input', listener);
      element.luminescenceSliderValue = "0.4";
      expect(listener).toHaveBeenCalledTimes(1);
    });
    it("set the value of the slider to a value greater than max value and looks if the the event is not dispatched", () => {
      const listener = vi.fn();
      element.curColor = "#ffff00";
      expect(parseFloat(element.luminescenceSliderMax)).toBeGreaterThanOrEqual(0.2);
      expect(parseFloat(element.luminescenceSliderMin)).toBeLessThanOrEqual(0);
      element.addEventListener('input', listener);
      element.luminescenceSliderValue = "0.4";
      expect(listener).toHaveBeenCalledTimes(0);
    });
    it("set the value of the slider to a value less than min value and looks if the the event is not dispatched", () => {
      const listener = vi.fn();
      document.body.innerHTML = /*html*/`
      <html-color-card mode="lighter" initial-color="#000000"></html-color-card>
    `;
      element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
      element.curColor = "#ffffff";
      expect(parseFloat(element.luminescenceSliderMax)).toBeGreaterThanOrEqual(1);
      expect(parseFloat(element.luminescenceSliderMin)).toBeLessThanOrEqual(0.46);
      element.addEventListener('input', listener);
      element.luminescenceSliderValue = "0.45";
      expect(element.luminescenceSliderValue).not.toBe("0.45");
      expect(listener).toHaveBeenCalledTimes(0);

    });
  });
  describe("Checking internal methods for developers of this web component", () => {
    /** @type {HTMLA11yColorCard} */
    let element;

    beforeEach(() => {
      document.body.innerHTML = '';
      element = /** @type {HTMLA11yColorCard} */ (document.createElement('html-color-card'));
      document.body.appendChild(element);
    });
    test("should warn developers when an unimplemented contrast value is provided", () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

      // Hier den noch nicht implementierten Wert triggern/setzen
      element.test_set_contrast("5");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Wrong contrast mode got") // oder dein spezifischer Text
      );

      // Mehrere Argumente im Test prüfen:
      // expect(consoleSpy).toHaveBeenCalledWith(
      //   expect.stringContaining("Unimplemented contrast"),
      //   expect.any(Array) // oder das konkrete Array
      // );

      consoleSpy.mockRestore();
    });
    test("Ratio color is set correct on normal sample", () => {
      document.body.innerHTML = /*html*/`
    <html-color-card mode="darker"></html-color-card>
  `;
      const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
      expect(element).toBeDefined();
      element.curColor = "#000000";
      const ratioElemNone = /** @type {HTMLParagraphElement} */ (element.test_root.querySelector(".row-ratio.none"));
      // console.log(ratioElemNone.classList.contains("failed"))
      const ratioElemRed = /** @type {HTMLParagraphElement} */ (element.test_root.querySelector(".row-ratio.red"));
      expect(ratioElemRed).toBeDefined();
      // console.log(ratioElemRed.classList.contains("failed"))
      expect(ratioElemNone.classList.contains("failed")).toBeTruthy();
      expect(ratioElemNone.classList.contains("failed")).toBeTruthy();
    });
  });
});