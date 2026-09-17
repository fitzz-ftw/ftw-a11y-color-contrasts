//@ts-check

/**
 * @typedef {object} FontEntry
 * @property {string} label
 * @property {string} family
 * @property {string} style
 * @property {string} sortkey
 * @property {boolean} [disabled]
 * 
 */


/**
 * Sammelt verfügbare Fonts, generiert einen sortkey für perfekte 
 * Roman/Italic-Sortierung und hängt die System-Defaults an.
 * @returns {Array<FontEntry>}
 */
export function getSortedFontListWithKey() {
  const familyMap = new Map();

  // 1. Stile pro Familie aus document.fonts erfassen
  for (const fontFace of document.fonts) {
    const family = fontFace.family.replace(/['"]+/g, '');
    const style = fontFace.style || 'normal';

    if (!familyMap.has(family)) {
      familyMap.set(family, new Set());
    }
    familyMap.get(family).add(style);
  }
  
  /**
   * Description placeholder
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

  // 4. System-Defaults für das Ende (bekommen einen Sortkey, der sie garantiert nach hinten sortiert, 
  // oder wir hängen sie einfach direkt an das fertige Array an)
  
  /**
   * Description placeholder
   *
   * @type {Array<FontEntry>}
   */
  const systemDefaults = [
    { label: 'Sans-Serif (System)', family: 'sans-serif', style: 'normal', sortkey:'sans-serif' },
    { label: 'Serif (System)', family: 'serif', style: 'normal', sortkey: 'serif' },
    { label: 'Monospace (System)', family: 'monospace', style: 'normal', sortkey: 'monospace' }
  ];

  // 5. Zusammenbauen: Sortierte Custom-Fonts + Spacer + System-Defaults
  return [
    ...items,
    { label: '──────────', family: '', style: '', disabled: true ,sortkey:'' },
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

