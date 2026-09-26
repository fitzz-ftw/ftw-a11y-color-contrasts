# Frage
Wo sind die unterschiede zwischen HappyDOM und JSDOM? Wen es geht mit Vor- und Nachteilen von beiden. Auch in der verbindung mit vitest, aber auch anderen Test umgenungen wie JEST.

## Antwort
Das ist ein exzellenter Punkt, besonders wenn man wie du mit modernen **Web Components**, dem Shadow DOM und DOM-Operationen arbeitet. Um diese im Node.js-basierten Test-Runner (wie Vitest oder Jest) auszuführen, braucht man eine DOM-Emulation.

Hier sind die Unterschiede, Vor- und Nachteile sowie die Einbindung in Test-Runner wie Vitest und Jest.

---

## 1. Was sind JSDOM und Happy-DOM?

Beide sind in JavaScript geschriebene Umgebungen, die dem Node.js-Prozess ein Browser-ähnliches DOM (`document`, `window`, `HTMLElement` etc.) vorgaukeln, obwohl kein echter Browser (wie Chrome oder Firefox) läuft.

* **JSDOM:** Der "Dinosaurier" und langjährige Standard. Er implementiert die Web-Standards extrem nah an den offiziellen Spezifikationen des W3C/WHATWG.
* **Happy-DOM:** Ein modernerer Herausforderer, der gezielt auf **Performance** und Geschwindigkeit optimiert wurde.

---

## 2. Die Hauptunterschiede im Überblick

| Kriterien | JSDOM | Happy-DOM |
| --- | --- | --- |
| **Geschwindigkeit** | Langsamer (oft speicherintensiver) | **Extrem schnell** (oft 2x bis 5x schneller) |
| **Standard-Treue** | Sehr hoch (sehr nah am Standard) | Gut, fokussiert sich aber auf Praxisnähe & Performance |
| **Ökosystem-Standard** | Standard bei **Jest** (wird oft direkt mitgeliefert) | Standard-Empfehlung bei **Vitest** |
| **Aktualität** | Entwicklung läuft stetig, aber behäbiger | Sehr aktiv, implementiert moderne APIs oft rasant |

---

## 3. Vor- und Nachteile im Detail

### **JSDOM**

* **Vorteile:**
* **Maximale Robustheit:** Da es seit vielen Jahren existiert und extrem strikt nach Spezifikation arbeitet, laufen Randfälle und komplexe DOM-Verschachtelungen sehr vorhersehbar.
* **Jest-Integration:** Ist bei Jest oft out-of-the-box oder mit minimalem Setup einsatzbereit.


* **Nachteile:**
* **Geschwindigkeit:** Bei großen Test-Suiten merkt man deutlich, dass JSDOM den Testlauf ausbremst.
* **Speicherverbrauch:** Neigt bei massenhaft erstellten DOM-Knoten eher zu Performance-Einbrüchen.



### **Happy-DOM**

* **Vorteile:**
* **Rasant schnell:** Der größte Pluspunkt. Tests laufen spürbar schneller durch, was die Developer Experience (Feedback-Loop) enorm steigert.
* **Moderne APIs:** Da es jünger ist, unterstützt es modernere Web-Standard-Schnipsel oft direkt, ohne dass man ewig auf Patches warten muss.


* **Nachteile:**
* **Edge Cases:** Gelegentlich kann es bei exotischen DOM-Operationen oder tiefen Custom-Element-Lifecycle-Hooks zu kleineren Abweichungen im Vergleich zu einem echten Browser kommen (wobei das stetig besser wird).



---

## 4. Verwendung in Vitest und Jest

Beide Test-Runner unterstützen standardmäßig beide Umgebungen, haben aber unterschiedliche Präferenzen.

### **In Vitest (Die moderne Heimat für Happy-DOM)**

Vitest liefert von Haus aus Unterstützung für beide mit. Du musst lediglich das entsprechende npm-Paket installieren und in deiner `vite.config.js` konfigurieren:

```bash
npm install -D happy-dom
# oder
npm install -D jsdom

```

In der `vite.config.js`:

```javascript
export default defineConfig({
  test: {
    environment: 'happy-dom', // oder 'jsdom'
  },
})

```

* **Empfehlung für Vitest:** Nimm **Happy-DOM**. Es harmoniert perfekt mit der extremen Geschwindigkeit von Vite und Vitest.

### **In Jest (Das traditionelle Zuhause von JSDOM)**

Jest nutzt historisch bedingt JSDOM als Standard.

In der `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom', // Standard in Jest
};

```

Man kann Jest zwar auch auf Happy-DOM umstellen (über Community-Pakete wie `jest-environment-happy-dom`), aber da Jest ohnehin langsamer als Vitest baut, greifen die meisten Jest-Nutzer klassischerweise einfach zu JSDOM.

---

## Fazit für dein Projekt

Da du mit **Vitest** und **Web Components** (also echtem DOM, Selects, Custom Elements etc.) arbeitest, fährst du mit **Happy-DOM** in Kombination mit Vitest am schnellsten und modernsten. Es gibt dir genau die DOM-Knoten, die deine `populateFontSelect`-Funktion braucht, verbrät aber kaum Rechenzeit.

Wollen wir den ersten DOM-Test für `populateFontSelect` aufsetzen?

## Antwort - Ja, gerne.
Perfekt! Dann richten wir das Ganze jetzt Schritt für Schritt für unsere DOM-Tests mit **Happy-DOM** ein.

### 1. Happy-DOM installieren

Führe im Terminal deines Projekts folgenden Befehl aus, um Happy-DOM als Entwicklungsabhängigkeit hinzuzufügen:

```bash
npm install -D happy-dom

```

### 2. In der `vite.config.js` hinterlegen

Damit Vitest weiß, dass es für die Tests eine DOM-Umgebung simulieren soll, ergänzen wir den `test`-Block in deiner Vite-Konfiguration (in `config/vite.config.js`):

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  // Deine bestehenden Configs...
  test: {
    environment: 'happy-dom', // Aktiviert das DOM für alle Tests
  },
});

```
#### Zwischenfrage
```js
export default defineConfig({
  test: {
    // Aktiviert globale Test-Funktionen (describe, it, expect), 
    // sodass du sie nicht in jeder Datei extra importieren musst.
    globals: true,
    // Da wir hier reine Logik-Utils testen, reicht die Node-Umgebung völlig aus
    environment: 'node',
  },
});
```
Was passiert hiermit? Überschreiben, oder anfügen?
##### Antwort
Das kommt darauf an, wie du es in deine bestehende `config/vite.config.js` einfügst.

Wenn du den gesamten `test`-Block in deiner Konfiguration **ersetzt**, dann passiert folgendes:

1. **`globals: true`**: Da hast du die bisherigen Importe von `{ describe, it, expect }` in deinen Testdateien ab sofort nicht mehr zwingend nötig. Vitest stellt diese Funktionen dann global im Test-Kontext zur Verfügung (genau wie Jest es standardmäßig macht). Viele mögen das, weil es Schreibarbeit spart; andere lassen es lieber auf `false` (oder weglassen), um explizit zu sehen, woher die Test-Methoden importiert werden.
2. **`environment: 'happy-dom'` (bzw. Änderung von `'node'` auf `'happy-dom'`):** Das ist hier der wichtigste Schalter! Wenn du das von `'node'` auf `'happy-dom'` umstellst, schaltest du das virtuelle DOM global für deine Test-Suite ein.

### Wichtig zu wissen bei `environment: 'node'` vs. `'happy-dom'` global:

Wenn du `environment: 'happy-dom'` global in der Config setzt, haben *alle* deine Tests Zugriff auf `document`, `window`, `HTMLElement` usw.

* Für reine Logik-Tests (wie unsere Font-Sortierung vorhin) stört das überhaupt nicht, weil die Node-Umgebung dadurch einfach um die DOM-APIs erweitert wird.
* Wenn du es **nicht** global für alle Tests haben möchtest, kannst du das Environment auch ganz gezielt nur für bestimmte Testdateien per **Pragma-Kommentar** direkt in der Testdatei überschreiben:

```javascript
/** @jest-environment happy-dom */  // (oder je nach Vitest-Kompatibilität direkt über docblock/Config)

```

In Vitest empfiehlt es sich bei einem dom-lastigen Projekt wie deinem aber meistens, `environment: 'happy-dom'` direkt in der `vite.config.js` fest einzutragen, da man ohnehin fast überall mit Elementen hantiert.

Möchtest du es direkt global auf `happy-dom` umstellen?


---

### 3. Der Test für `populateFontSelect`

Jetzt können wir den passenden Test schreiben, der prüft, ob das `<select>`-Element korrekt geleert, mit Optionen befüllt und die JSON-Werte sowie `disabled`-Zustände fehlerfrei gesetzt werden.

Lege eine neue Datei an (z. B. `src/utils/populate-select.test.js` oder direkt neben deiner Quelldatei):

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { populateFontSelect } from './path-to-your-source-file.js'; // Pfad anpassen

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

```

Probier das aus: Wenn du jetzt `npm run test:run` startest, feuert Happy-DOM im Hintergrund das virtuelle DOM an, und die Select-Elemente werden blitzschnell im Speicher getestet!