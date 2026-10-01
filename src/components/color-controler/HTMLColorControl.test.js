//@ts-check

import { describe, it, expect, beforeEach, afterEach, test, vi } from 'vitest';

import { ControlEventEnum, HTMLColorControl } from './HtmlColorControl.js';

if (!customElements.get('html-color-control')) {
  customElements.define('html-color-control', HTMLColorControl);
}


describe('HTMLColorControl (Web Designer BDD Perspective)', () => {

  /**
   * Description placeholder
   *
   * @type {HTMLColorControl}
   */
  let control;
  /** @type{import('./HtmlColorControl.js').OnChangeDetail} */
  let eventDetail;

  // const simpleDiv = document.createElement('div')

  beforeEach(async () => {
    control = /** @type {HTMLColorControl} */(document.createElement('html-color-control'));
    // document.body.appendChild(simpleDiv);
    // simpleDiv.appendChild(control)
    document.body.appendChild(control);
    eventDetail = {
      color: { new: "", old: "" },
      eventsource: "initial",
      font: { new: "", old: "" },
      hue: { new: "", old: "" },
      sat: { new: "", old: "" },
      text: { new: "", old: "" }
    };
    document.addEventListener('config-change', (e) => {
      const el = /** @type {CustomEvent} e */(e);
      eventDetail = /** @type{import('./HtmlColorControl.js').OnChangeDetail} */(el.detail);
    });

    // Warten bis das Element verbunden ist und initialisiert wurde
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  afterEach(() => {
    control.remove();
    // simpleDiv.remove()
  });
  it('should enforce a closed shadow root and deny external DOM access', () => {
    const control = /** @type {HTMLColorControl} */(document.createElement('html-color-control'));
    // document.body.appendChild(control);

    // Der Beweis für den Webdesigner / die Außenwelt: Keine Hintertüren!
    expect(control.shadowRoot).toBeNull();

    // document.body.removeChild(control);
  });

  it('should initialize with default UI values and fire initial change event', () => {
    // Element erzeugen und anhängen
    const control = document.createElement('html-color-control');
    document.body.appendChild(control);

    // Das Window-Load-Event manuell feuern, um den Listener zu triggern
    window.dispatchEvent(new Event('load'));

    document.body.removeChild(control);

    // Hier kannst du jetzt prüfen, ob z.B. das Event gefeuert wurde
  });

  it('should initialize UI with "id" and "for"', () => {
    const controlstr = "<html-color-control id='c1' for='cf1'></html-color-control>";
    document.body.innerHTML = controlstr;

    control = /** @type {HTMLColorControl}*/(document.getElementById("c1"));

    expect(control.test_connectedCardIds.includes("cf1")).toBeTruthy();
    expect(control.id).toBe("c1");

    // Das Window-Load-Event manuell feuern, um den Listener zu triggern

    document.body.innerHTML = "";

    // Hier kannst du jetzt prüfen, ob z.B. das Event gefeuert wurde
  });
  it('should initialize UI with empty "for"', () => {
    const controlstr = "<html-color-control id='c1' for=''></html-color-control>";
    document.body.innerHTML = controlstr;

    control = /** @type {HTMLColorControl}*/(document.getElementById("c1"));

    expect(control.test_connectedCardIds.length).toBe(0);
    expect(control.id).toBe("c1");

    // Das Window-Load-Event manuell feuern, um den Listener zu triggern

    control.setAttribute("for", "");

    control.setAttribute("for", "cc2");

    document.body.innerHTML = "";

    // Hier kannst du jetzt prüfen, ob z.B. das Event gefeuert wurde
  });

  it('should initialize UI with "initial-color"', () => {
    const controlstr = "<html-color-control id='c1' initial-color='#ff0000' ></html-color-control>";
    document.body.innerHTML = controlstr;

    control = /** @type {HTMLColorControl}*/(document.getElementById("c1"));

    expect(eventDetail.color.new).toBe("#ff0000");
    expect(eventDetail.eventsource).toBe('base-color');


    document.body.innerHTML = "";

    // Hier kannst du jetzt prüfen, ob z.B. das Event gefeuert wurde
  });
  it('should initialize UI with empty "initial-color"', () => {
    const controlstr = "<html-color-control id='c1' initial-color='' ></html-color-control>";
    document.body.innerHTML = controlstr;

    control = /** @type {HTMLColorControl}*/(document.getElementById("c1"));

    expect(eventDetail.color.new).toBe("#18fbf8");
    expect(eventDetail.eventsource).toBe('initial');


    document.body.innerHTML = "";

    // Hier kannst du jetzt prüfen, ob z.B. das Event gefeuert wurde
  });
  it('should initialize UI with "initial-preview-text"', () => {
    const controlstr = "<html-color-control id='c1' initial-preview-text='Hello world' ></html-color-control>";
    document.body.innerHTML = controlstr;

    control = /** @type {HTMLColorControl}*/(document.getElementById("c1"));

    expect(eventDetail.text.new).toBe("Hello world");
    expect(eventDetail.eventsource).toBe('preview-text');


    document.body.innerHTML = "";

    // Hier kannst du jetzt prüfen, ob z.B. das Event gefeuert wurde
  });
  it('should initialize UI with empty "initial-preview-text"', () => {
    const controlstr = "<html-color-control id='c1' initial-preview-text ></html-color-control>";
    document.body.innerHTML = controlstr;

    control = /** @type {HTMLColorControl}*/(document.getElementById("c1"));

    expect(eventDetail.text.new).toBe("Accessibility sample text");
    expect(eventDetail.eventsource).toBe('initial');


    document.body.innerHTML = "";

    // Hier kannst du jetzt prüfen, ob z.B. das Event gefeuert wurde
  });

});

describe("The JS API of the component", () => {
  /**
   * Description placeholder
   *
   * @type {HTMLColorControl}
   */
  let control;
  /** @type{import('./HtmlColorControl.js').OnChangeDetail} */
  let eventDetail;

  beforeEach(async () => {
    control = /** @type {HTMLColorControl} */(document.createElement('html-color-control'));
    document.body.appendChild(control);
    eventDetail = {
      color: { new: "", old: "" },
      eventsource: "initial",
      font: { new: "", old: "" },
      hue: { new: "", old: "" },
      sat: { new: "", old: "" },
      text: { new: "", old: "" }
    };
    document.addEventListener('config-change', (e) => {
      const el = /** @type {CustomEvent} e */(e);
      eventDetail = /** @type{import('./HtmlColorControl.js').OnChangeDetail} */(el.detail);
    });
  });

  afterEach(() => {
    control.remove();
  });

  it("change the color", () => {
    control.color = "rgb(0, 255,0)";
    expect(eventDetail.color.new).toBe(control.color);
  });
  it("changes the preview text", () => {
    control.previewText = "Hello world";
    expect(eventDetail.text.new).toBe(control.previewText);

  });


});

describe("Internal events on interaction with UI", () => {
  /**
   * Description placeholder
   *
   * @type {HTMLColorControl}
   */
  let control;
  /** @type{import('./HtmlColorControl.js').OnChangeDetail} */
  let eventDetail;

  beforeEach(() => {
    control = /** @type {HTMLColorControl} */(document.createElement('html-color-control'));
    document.body.appendChild(control);
    eventDetail = {
      color: { new: "", old: "" },
      eventsource: "initial",
      font: { new: "", old: "" },
      hue: { new: "", old: "" },
      sat: { new: "", old: "" },
      text: { new: "", old: "" }
    };
    control.addEventListener('config-change', (e) => {
      const el = /** @type {CustomEvent} e */(e);
      eventDetail = /** @type{import('./HtmlColorControl.js').OnChangeDetail} */(el.detail);
    });

  });

  afterEach(() => {
    control.remove();
  });

  test("correctly process fonts when document.fonts is available", () => {
    // Ein Mock-Objekt, das sich wie document.fonts verhält (z.B. iterierbar ist)
    const mockFonts = [
      { family: "Arial", style: "normal", weight: "400" },
      { family: "Roboto", style: "italic", weight: "700" }
    ];

    // document.fonts für den Test überschreiben/definieren
    Object.defineProperty(document, 'fonts', {
      value: mockFonts,
      configurable: true,
      writable: true
    });
    const controlstr = "<html-color-control id='c1' for='cf1'></html-color-control>";
    document.body.innerHTML = controlstr;

    control = /** @type {HTMLColorControl} */(document.getElementById("c1"));
    const firstFont = control.test_fontFamily.value;
    expect(firstFont).toBe('{"family":"Arial","style":"normal"}');
  });


  test('synchronize color picker and text input when base color changes', async () => {

    const colorInput = control.test_colorInput;
    colorInput.value = '#ff0000';
    colorInput.dispatchEvent(new Event('change'));

    const colorPicker = control.test_colorPicker;
    expect(colorPicker.value).toBe('#ff0000');
    expect(eventDetail).toBeDefined();
    if (!eventDetail) return;
    expect(eventDetail.color.new).toBe('#ff0000');
    expect(eventDetail.eventsource).toBe('base-color');
  });

  test('update hue display and dispatch event on slider input', () => {

    const hueSlider = control.test_hueSlider;

    hueSlider.value = '200';
    hueSlider.dispatchEvent(new Event('input'));

    expect(control.test_hueValueDisplay.textContent).toBe('200');
    expect(eventDetail.hue.new).toBe('200');
    expect(eventDetail.eventsource).toBe('hue');
  });

  test('update preview text when input changes', () => {

    const previewTextInput = control.test_previewText;
    control.previewText = 'Barrierefreiheit im Fokus';
    previewTextInput.dispatchEvent(new Event('change'));

    expect(eventDetail.text.new).toBe(control.previewText);
    expect(eventDetail.eventsource).toBe('preview-text');
  });
  test("update font family when select an item", () => {
    control.test_fontFamily.selectedIndex = 1;
    control.test_fontFamily.dispatchEvent(new Event('change'));
    const selectedFont = control.test_fontFamily.value;
    expect(selectedFont).toBe('{"family":"Roboto","style":"normal"}');
    expect(eventDetail.font.new).toBe(selectedFont);
    expect(eventDetail.eventsource).toBe('font-family');


  });
  test("update saturation display and dispatch event on slider input", () => {
    control.test_satSlider.value = "0.8";
    control.test_satSlider.dispatchEvent(new Event('input'));
    expect(control.test_satValueDisplay.innerText).toBe("80.0 %");
    expect(eventDetail.sat.new).toBe("0.8");
    expect(eventDetail.eventsource).toBe('saturation');

  });
  test("update color on select a color in color picker and no ping pong with color input ", () => {
    const controlSpy = vi.spyOn(control, 'test_dispathChangeEvent');

    control.test_colorPicker.value = "#ff0000";
    control.test_colorPicker.dispatchEvent(new Event('change'));
    expect(eventDetail.color.new).toBe("#ff0000");
    expect(eventDetail.eventsource).toBe('base-color');
    expect(control.test_colorInput.value).toBe("#ff0000");
    expect(controlSpy).toHaveBeenCalledTimes(1);

    // Testing no ping-pong between colorInput and colorPicker 
    control.test_colorInput.dispatchEvent(new Event('change'));
    expect(controlSpy).toHaveBeenCalledTimes(1);
    control.test_colorPicker.dispatchEvent(new Event('change'));
    expect(controlSpy).toHaveBeenCalledTimes(1);


  });
  test("alls new values of change details are null", () => {
    const detail = eventDetail;
    detail.eventsource = ControlEventEnum.INITIAL;
    control.test_nullNewBranchesUpdateConnectedCards(detail);
  });

});



