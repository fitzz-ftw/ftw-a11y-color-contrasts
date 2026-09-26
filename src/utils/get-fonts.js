//@ts-check

/**
 * 
 * @typedef {object} FontEntry -Interface for font entries for sorting and generating selct options.
 * @property {string} label - Label for the display
 * @property {string} family - Name of the font family
 * @property {"normal"|"italic"} style - Style of the fond can be "normal" or "italic"
 * @property {string} sortkey - Key to sort teh list
 * @property {boolean} [disabled] - Is item used for fonts.
 * 
 */


/**
 * Create a sorted font list including separators and system defaults.
 * 
 * Processes the provided font faces, generates a sort key for 
 * clean Roman/Italic ordering, and appends system default fonts.
 * 
 * @param {Iterable<FontFace>|Iterable<{ family: string, style?: string }>} fontSource - The source for font faces.
 * @returns {Array<FontEntry>} The structured and sorted font list.
 */
export function getSortedFontListWithKey(fontSource) {
  const familyMap = new Map();

  // 1. Stile pro Familie aus der übergebenen Quelle erfassen
  for (const fontFace of fontSource) {
    const family = fontFace.family.replace(/['"]+/g, '');
    const style = fontFace.style || 'normal';

    if (!familyMap.has(family)) {
      familyMap.set(family, new Set());
    }
    familyMap.get(family).add(style);
  }

  /**
   * Result fonts
   *
   * @type {Array<FontEntry>}
   */
  const items = [];

  // 2. Einträge mit sortkey generieren
  for (const [family, styles] of familyMap.entries()) {
    // Regulärer Schnitt (Roman)
    items.push({
      label: family,
      family: family,
      style: 'normal',
      sortkey: `${family.toLowerCase()}_a`
    });

    // Kursiver Schnitt, falls vorhanden
    if (styles.has('italic') || styles.has('oblique')) {
      items.push({
        label: `${family} Italic`,
        family: family,
        style: 'italic',
        sortkey: `${family.toLowerCase()}_b`
      });
    }
  }

  // 3. Einmal sauber über den sortkey alphabetisch sortieren
  items.sort((a, b) => a.sortkey.localeCompare(b.sortkey));

  // 4. System-Defaults für das Ende
  /**
   * System default fonts
   *
   * @type {Array<FontEntry>}
   */
  const systemDefaults = [
    { label: 'Sans-Serif (System)', family: 'sans-serif', style: 'normal', sortkey: 'sans-serif' },
    { label: 'Serif (System)', family: 'serif', style: 'normal', sortkey: 'serif' },
    { label: 'Monospace (System)', family: 'monospace', style: 'normal', sortkey: 'monospace' }
  ];

  // 5. Zusammenbauen: Sortierte Custom-Fonts + Spacer + System-Defaults
  return [
    ...items,
    { label: '──────────', family: '', style: 'normal', disabled: true, sortkey: '' },
    ...systemDefaults
  ];
}

/**
 * Populates a select element with the structured font list.
 * @param {HTMLSelectElement} selectElement - The target select element
 * @param {Array<FontEntry>} fontList - The structured array of font objects
 */
export function populateFontSelect(selectElement, fontList) {
  selectElement.innerHTML = '';

  for (const font of fontList) {
    const option = document.createElement('option');
    option.textContent = font.label;

    if (font.disabled) {
      option.disabled = true;
    } else {
      // Store font family and style in dataset for easy retrieval on change
      option.value = JSON.stringify({ family: font.family, style: font.style });
    //   option.dataset.fontFamily = font.family;
    //   option.dataset.fontStyle = font.style;
    }

    selectElement.appendChild(option);
  }
}

