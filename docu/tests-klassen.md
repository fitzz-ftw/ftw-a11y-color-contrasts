# Frage
Jetzt testen wir eine Klasse, noch ohne DOM. Was ist dabei zu beachten gegenüber reinen Funktionen?

## Antwort
Das Testen einer Klasse im Vergleich zu einer reinen Funktion bringt spannende architektonische Unterschiede mit sich. Wenn wir uns deine  [`ColorContrastPairs`-Klasse](../src/utils/ColorContrastPair.js#L15) ansehen, wird das sofort deutlich: Hier haben wir es mit **Zustand (State), Kapselung und automatisierter Initialisierung** zu tun.

Hier sind die wichtigsten Punkte, auf die du beim Testen einer solchen Klasse achten musst:

### 1. Zustand und Instanziierung (Stateful vs. Stateless)

* **Reine Funktionen:** Sind zustandslos. Gleicher Input = gleicher Output. Man testet sie isoliert.
* **Klassen:** Speichern Zustand in Instanzen. Das bedeutet, für jeden Test musst du eine neue Instanz erzeugen (`const pair = new ColorContrastPairs('#ffffff')`). Du musst sicherstellen, dass Tests sich nicht gegenseitig über geteilten Zustand beeinflussen.

### 2. Schwere Konstruktoren (Constructor Side-Effects)

* In deiner Klasse ruft der Konstruktor direkt `this.calculate()` auf.
* Das bedeutet: Allein durch das Erstellen des Objekts (`new ColorContrastPairs(...)`) läuft im Hintergrund sofort die gesamte rechenintensive Binärsuche für alle Kontraststufen (3.0, 4.5, 7.0 für heller und dunkler) ab.
* **Worauf achten:** Der Test misst implizit immer auch die Performance und Korrektheit der Initialisierung. Man testet hier also eher das fertige Ergebnis nach dem Instanziieren als einzelne Schritte.

### 3. Kapselung durch private Felder (`#`)

* Deine Klasse nutzt konsequent private Felder (`#mainColor`, `#recursions`, `#darker70` etc.).
* **Worauf achten:** Von außen kommst du an diese internen Variablen per Test *nicht* heran. Du kannst `#mainColor` oder die Zwischenschritte der Binärsuche nicht direkt auslesen.
* **Die Konsequenz:** Du bist gezwungen, **rein über die öffentliche API (Getter und öffentliche Methoden)** zu testen. Das ist architektonisch eigentlich ein riesiger Vorteil (Black-Box-Test), bedeutet aber, dass deine Getter (`darker70`, `darker70Ratio`, etc.) absolut verlässlich sein müssen.

### 4. Numerische Toleranzen (Gleitkommazahlen & Farben)

* Da die Klasse mit WCAG-Luminanzen, HSL-Werten und Farbkonvertierungen (`culori`) arbeitet, spielen Fließkommazahlen eine große Rolle.
* **Worauf achten:** Vergleiche bei Kontrast-Ratios oder Hex-Werten niemals blind mit exakten harten Brüchen, wenn Rundungen im Spiel sind. In Vitest nutzt man für Zahlen lieber `expect(ratio).toBeCloseTo(4.5, 1)` statt eines starren `toBe()`.

---

### Wie sieht ein erster Testansatz dafür aus?

Da die Klasse bei Übergabe einer Farbe (z. B. Weiß `#ffffff` oder Schwarz `#000000`) sofort rechnet, können wir direkt gegen die Getter testen:

```javascript
import { describe, it, expect } from 'vitest';
import ColorContrastPairs from './ColorContrastPair.js';

describe('ColorContrastPairs', () => {
  it('should calculate contrast variants correctly for a white background', () => {
    // Arrange & Act: Konstruktor triggert calculate()
    const colorPair = new ColorContrastPairs('#ffffff');

    // Assert: Prüfen, ob die öffentlichen Getter sinnvolle Werte liefern
    expect(colorPair.originalColor).toBe('#ffffff');
    expect(colorPair.ariaLum).toBe(1); // Weiß hat maximale Luminanz

    // Dunklere Kontraste müssen bei einem weißen Hintergrund gefunden werden
    expect(colorPair.darker70).toBeDefined();
    expect(colorPair.darker70Ratio).toBeGreaterThanOrEqual(7.0);
  });
});

```

Wollen wir die Test-Suite für diese Klasse aufbauen und mit einem Test für Weiß/Schwarz starten?