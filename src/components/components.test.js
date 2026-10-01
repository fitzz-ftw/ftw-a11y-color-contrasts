import { describe, it, expect, beforeEach, afterEach, test } from "vitest";

import { ControlEventEnum, HTMLColorControl } from "./color-controler/HtmlColorControl.js";
import {  HTMLA11yColorCard } from "./color-card/HtmlA11yColorCard.js";

if (!customElements.get("html-color-card")) {
  customElements.define("html-color-card", HTMLA11yColorCard);
}

if (!customElements.get("html-color-control")) {
  customElements.define("html-color-control", HTMLColorControl);
}
describe("Managing HTMLColorControl and HTMLA11yColorCards by HTML attributes", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  it("should add a created html-color-card with id to a html-color-control bey using for attribut", () => {
    const cardStr = "<html-color-card id='card-1'></html-color-card>";
    const controlStr =
      "<html-color-control for='card-1' id='control'></html-color-control>";
    // document.body.innerHTML = `${cardStr}\n\n${controlStr}`
    document.body.innerHTML = `${controlStr}\n\n${cardStr}`;
    const control = /** @type {HTMLColorControl}*/ (
      document.getElementById("control")
    );
    expect(control.test_connectedCardIds.includes("card-1"));
  });
});


describe("Intern methodes emitted because of interactive Actions", () => {
  /**
   * Description placeholder
   *
   * @type {HTMLColorControl}
   */
  let control;
  /** @type{import('./color-controler/HtmlColorControl.js').OnChangeDetail} */
  let eventDetail;

  /**
   * Description placeholder
   *
   * @type {Array<HTMLA11yColorCard>}
   */
  let cards = new Array();

  beforeEach(() => {
    eventDetail = {
      color: { new: "", old: "" },
      eventsource: "initial",
      font: { new: "", old: "" },
      hue: { new: "", old: "" },
      sat: { new: "", old: "" },
      text: { new: "", old: "" },
    };
    control = /** @type {HTMLColorControl} */ (
      document.createElement("html-color-control")
    );
    const card = /** @type {HTMLA11yColorCard} */ (
      document.createElement("html-color-card")
    );
    card.id = "card-1";
    control.setAttribute("for", "card-1");
    control.setAttribute("initial-preview-text", "Hallo World");
    document.body.appendChild(control);
    cards.push(card);
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("sets a card later", () => {
    /** @type {string} */
    let key;
    /** @type {boolean} */
    let valueB;
    /** @type {[string,boolean]} */
    const defaultItem = ["", false];
    const testCard = cards[0];
    document.body.appendChild(testCard);
    expect(testCard.exampleText).toBe("Beispieltext für Barrierefreiheit");
    control.addCard("");
    expect(testCard.exampleText).toBe("Hallo World");
    [key, valueB] =
      control.getCardStatuses().entries().next().value ?? defaultItem;
    expect(key).toBe("card-1");
    expect(valueB).toBe(true);
    control.addCard("card-1");
    expect([...control.getCardStatuses()].length).toBe(1);
    control.removeCard("card-1");
    expect([...control.getCardStatuses()].length).toBe(0);
    control.addCard("card-1");
    [key, valueB] =
      control.getCardStatuses().entries().next().value ?? defaultItem;
    expect(key).toBe("card-1");
    expect(valueB).toBe(true);
  });
  test("move hue slider and use short circuit", () => {
    const testCard = cards[0];
    document.body.appendChild(testCard);
    control.addCard("");
    control.test_hueSlider.value = "0.6";
    control.test_hueSlider.dispatchEvent(new Event("input"));
    const div = document.createElement("div");
    div.id = "div-1";
    document.body.appendChild(div);
    control.addCard("div-1");
    control.removeCard("div-1");
  }
  );
  test("alls new values of change details are null", () => {
    
    /**
     * Description placeholder
     *
     * @type {import('./color-controler/HtmlColorControl.js').OnChangeDetail}
     */
    const testCard = cards[0];
    document.body.appendChild(testCard);
    control.addCard("");
    const detail = {...eventDetail};
    detail.eventsource = ControlEventEnum.INITIAL;
    control.test_nullNewBranchesUpdateConnectedCards(detail);
    detail.eventsource = ControlEventEnum.BASE_COLOR;
    control.test_nullNewBranchesUpdateConnectedCards(detail);
  });
});
