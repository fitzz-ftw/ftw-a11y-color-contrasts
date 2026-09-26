// @ts-check
import { describe, it, expect } from 'vitest';
import { getSortedFontListWithKey } from './get-fonts.js'; // Pfad entsprechend anpassen

describe('getSortedFontListWithKey', () => {

  it('should handle an empty font source gracefully', () => {
    // Arrange
    /** @type {Iterable<FontFace>} */
    const emptySource = [];

    // Act
    const result = getSortedFontListWithKey(emptySource);

    // Assert: Only spacer and system defaults should be present
    expect(result).toHaveLength(4); // 1 spacer + 3 system defaults
    expect(result[0].disabled).toBe(true); // Spacer check
    expect(result[1].family).toBe('sans-serif');
  });

  it('should correctly process a single font entry', () => {
    // Arrange
    const singleSource = [
      { family: 'Roboto', style: 'normal' }
    ];

    // Act
    const result = getSortedFontListWithKey(singleSource);

    // Assert
    expect(result).toHaveLength(5); // 1 custom + 1 spacer + 3 defaults
    expect(result[0]).toMatchObject({
      label: 'Roboto',
      family: 'Roboto',
      style: 'normal',
      sortkey: 'roboto_a'
    });
  });

  it('should correctly process a single font entry without optional style', () => {
    // Arrange
    const singleSource = [
      { family: 'Roboto' }
    ];

    // Act
    const result = getSortedFontListWithKey(singleSource);

    // Assert
    expect(result).toHaveLength(5); // 1 custom + 1 spacer + 3 defaults
    expect(result[0]).toMatchObject({
      label: 'Roboto',
      family: 'Roboto',
      style: 'normal',
      sortkey: 'roboto_a'
    });
  });


  it('should sort multiple different font families alphabetically', () => {
    // Arrange
    const multipleSource = [
      { family: 'Zeta', style: 'normal' },
      { family: 'Arial', style: 'normal' }
    ];

    // Act
    const result = getSortedFontListWithKey(multipleSource);

    // Assert: Arial must come before Zeta
    expect(result[0].family).toBe('Arial');
    expect(result[1].family).toBe('Zeta');
  });

  it('should group and sort multiple styles of the same family correctly', () => {
    // Arrange: Same family with normal and italic styles
    const styledSource = [
      { family: 'Roboto', style: 'italic' },
      { family: 'Roboto', style: 'normal' }
    ];

    // Act
    const result = getSortedFontListWithKey(styledSource);

    // Assert: Normal (suffix _a) should come before Italic (suffix _b)
    expect(result[0]).toMatchObject({
      label: 'Roboto',
      style: 'normal',
      sortkey: 'roboto_a'
    });
    expect(result[1]).toMatchObject({
      label: 'Roboto Italic',
      style: 'italic',
      sortkey: 'roboto_b'
    });
  });
  
  it('should handle identical font entries gracefully without duplicating them', () => {
    // Arrange: Zwei absolut identische Fonts im Quellstrom
    /** @type {Array<{ family: string, style: string }>} */
    const fontSource = [
      { family: 'Open Sans', style: 'normal' },
      { family: 'Open Sans', style: 'normal' } // Duplikat!
    ];

    // Act
    const result = getSortedFontListWithKey(fontSource);

    // Assert: Es darf nur ein Eintrag für Open Sans da sein (plus Spacer & System-Defaults)
    const openSansEntries = result.filter(entry => entry.family === 'Open Sans');
    expect(openSansEntries).toHaveLength(1);
  });
});


import { beforeEach } from 'vitest';
import { populateFontSelect } from './get-fonts.js'; // Pfad anpassen

describe('populateFontSelect', () => {
  /** @type {HTMLSelectElement} */
  let selectElement;

  beforeEach(() => {
    // Erstelle vor jedem Test ein frisches Select-Element im simulierten DOM
    selectElement = document.createElement('select');
  });

  it('should clear existing children and handle an empty font list', () => {
    // Arrange: Füge alte Einträge hinzu, um sicherzustellen, dass geleert wird
    selectElement.innerHTML = '<option>Old Option</option>';
    /** @type {Array<any>} */
    const emptyList = [];

    // Act
    populateFontSelect(selectElement, emptyList);

    // Assert
    expect(selectElement.children).toHaveLength(0);
  });

  it('should correctly populate options, disabled states, and JSON values', () => {
    // Arrange
    /** @type {Array<any>} */
    const fontList = [
      { label: '--- Select Font ---', disabled: true },
      { label: 'Roboto', family: 'Roboto', style: 'normal', disabled: false }
    ];

    // Act
    populateFontSelect(selectElement, fontList);

    // Assert: Anzahl der Optionen prüfen
    expect(selectElement.children).toHaveLength(2);

    // Prüfe den Spacer (disabled)
    const firstOption = /** @type {HTMLOptionElement} */ (selectElement.children[0]);
    expect(firstOption.textContent).toBe('--- Select Font ---');
    expect(firstOption.disabled).toBe(true);

    // Prüfe den echten Font-Eintrag
    const secondOption = /** @type {HTMLOptionElement} */ (selectElement.children[1]);
    expect(secondOption.textContent).toBe('Roboto');
    expect(secondOption.disabled).toBe(false);
    expect(secondOption.value).toBe(JSON.stringify({ family: 'Roboto', style: 'normal' }));
  });

});