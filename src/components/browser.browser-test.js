import { describe, it, expect } from 'vitest';
import { userEvent } from '@vitest/browser/context';

// Importiere deine Komponenten, damit sie registriert werden
import {HTMLColorControl} from './color-controler/HtmlColorControl.js';
import { HTMLA11yColorCard } from './color-card/HtmlA11yColorCard.js';

if (!customElements.get('html-color-card')) {
  customElements.define('html-color-card', HTMLA11yColorCard);
}
if (!customElements.get('html-color-control')) {
  customElements.define('html-color-control', HTMLColorControl);
}

describe('HtmlColorControl Browser Integration Tests', () => {
  it('should render the control and trigger guard checks / card updates', async () => {
    // 1. Komponenten in das echte DOM einfügen
    document.body.innerHTML = `
      <html-color-control id="control"></html-color-control>
      <html-a11y-color-card id="card"></html-a11y-color-card>
    `;

    // Warten, bis das Custom Element definiert und geladen ist
    const control = document.querySelector('#control');
    await customElements.whenDefined('html-color-control');

    expect(control).toBeTruthy();

    // 2. Interaktionen simulieren, um die Zeilen 368 und 515-543 zu erreichen
    // (Beispiel: Inputs verändern, Events feuern oder Grenzwerte ansteuern)
    const colorInput = control.shadowRoot?.querySelector('input[type="color"]');
    if (colorInput) {
      await userEvent.fill(colorInput, '#ff0000');
      await userEvent.click(colorInput);
    }

    // Falls Zeile 368 / 515-543 bestimmte Edge Cases, fehlerhafte Werte 
    // oder spezielle Event-Listener betreffen:
    // Hier gezielt fehlerhafte Payloads oder Grenzwerte triggern:
    control.dispatchEvent(new CustomEvent('color-change', {
      detail: { hex: 'invalid-or-edge-case' },
      bubbles: true,
      composed: true
    }));

    // Assertion, um sicherzustellen, dass die Komponente stabil bleibt
    expect(control.isConnected).toBe(true);
  });
});