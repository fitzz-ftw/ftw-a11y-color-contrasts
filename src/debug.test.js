// @ts-check

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HTMLA11yColorCard } from "./components/color-card/HtmlA11yColorCard.js";
import { HTMLColorControl } from './components/color-controler/HtmlColorControl.js';
import { ColorContrastPairs } from './utils/ColorContrastPair.js';

if (!customElements.get('html-color-card')) {
  customElements.define('html-color-card', HTMLA11yColorCard);
}
if (!customElements.get('html-color-control')) {
  customElements.define('html-color-control', HTMLColorControl);
}

describe.skip('HTMLA11yColorCard via HTML tag and attributes, ', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // it('should check if color is valid color', () => {
  //   document.body.innerHTML = /*html*/`
	// 		<html-color-card mode="darker"></html-color-card>
	// 	`;

  //   const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
  //   let validColor = element.isLegalColor("#ffffff")
  //   expect(validColor).toBeDefined();
  //   expect(validColor).toBe(false);
  //   element.setAttribute("mode", "lighter")
  //   validColor = element.isLegalColor("#000000")
  //   expect(validColor).toBe(false);
  // });
  // it("Ratio color is set correct on normal sample", () => {
  //   document.body.innerHTML = /*html*/`
  //   <html-color-card mode="darker"></html-color-card>
  // `;
  //   const element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
  //   expect(element).toBeDefined()
  //   element.curColor = "#000000"
  //   const ratioElemNone = /** @type {HTMLParagraphElement} */ (element.test_root.querySelector(".row-ratio.none"))
  //   // console.log(ratioElemNone.classList.contains("failed"))
  //   const ratioElemRed = /** @type {HTMLParagraphElement} */ (element.test_root.querySelector(".row-ratio.red"))
  //   expect(ratioElemRed).toBeDefined()
  //   // console.log(ratioElemRed.classList.contains("failed"))
  //   expect(ratioElemNone.classList.contains("failed")).toBeTruthy()
  //   expect(ratioElemNone.classList.contains("failed")).toBeTruthy()
  // })

})

describe.skip("The API for the lumincense slider provided by the component", () => {
  /** @type {HTMLA11yColorCard} */
  let element
  beforeEach(() => {
    document.body.innerHTML = /*html*/`
    <html-color-card initial-color="#000000"></html-color-card>
  `;
    element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
    expect(element).toBeDefined()

  })
  afterEach(() => {
    document.body.innerHTML = '';
  });
  // it("checks if the disabled property is true if impossible combination is used", () => {
  //   expect(element).toBeDefined()
  //   expect(element.test_slider.disabled).toBeTruthy()
  // })
  // it("checks if the disabled property is false if proper combination is used",()=>{
  //   element.curColor =  "#ffffff"
  //   expect(element.test_slider.disabled).toBeFalsy()
  // })
  // it("set the value of the slider und looks if the the event is not dispatched if disabled",()=>{
  //   const listener = vi.fn();
  //   element.addEventListener('input', listener);
  //   element.luminescenceSliderValue ="0.5"
  //   expect(listener).toHaveBeenCalledTimes(0);
  // })
  // it("set the value of the slider and looks if the the event is dispatched if not disabled", () => {
  //   const listener = vi.fn();
  //   element.curColor = "#ffffff"
  //   expect(parseFloat(element.luminescenceSliderMax)).toBeGreaterThanOrEqual(0.4)
  //   expect(parseFloat(element.luminescenceSliderMin)).toBeLessThanOrEqual(0.4)
  //   element.addEventListener('input', listener);
  //   element.luminescenceSliderValue = "0.4"
  //   expect(listener).toHaveBeenCalledTimes(1);
  // })
  // it("set the value of the slider to a value greater than max value and looks if the the event is not dispatched", () => {
  //   const listener = vi.fn();
  //   element.curColor = "#ffff00"
  //   expect(parseFloat(element.luminescenceSliderMax)).toBeGreaterThanOrEqual(0.2)
  //   expect(parseFloat(element.luminescenceSliderMin)).toBeLessThanOrEqual(0)
  //   element.addEventListener('input', listener);
  //   element.luminescenceSliderValue = "0.4"
  //   expect(listener).toHaveBeenCalledTimes(0);
  // })
  // it("set the value of the slider to a value less than min value and looks if the the event is not dispatched", () => {
  //   const listener = vi.fn();
  //   document.body.innerHTML = /*html*/`
  //   <html-color-card mode="lighter" initial-color="#000000"></html-color-card>
  // `;
  //   element = /** @type {HTMLA11yColorCard} */ (document.body.querySelector('html-color-card'));
  //   element.curColor = "#ffffff"
  //   expect(parseFloat(element.luminescenceSliderMax)).toBeGreaterThanOrEqual(1)
  //   expect(parseFloat(element.luminescenceSliderMin)).toBeLessThanOrEqual(0.46)
  //   element.addEventListener('input', listener);
  //   element.luminescenceSliderValue = "0.45"
  //   expect(element.luminescenceSliderValue).not.toBe("0.45")
  //   expect(listener).toHaveBeenCalledTimes(0);
  // })
})


