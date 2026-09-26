Hier ist eine kompakte Übersicht der wichtigsten Vitest-Befehle, Matcher und Mocking-Funktionen, die man im täglichen Entwickleralltag am häufigsten braucht:

## 1. Struktur & Lifecycle

```javascript
import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

describe('Modul-Gruppe', () => {
  beforeAll(() => { /* Einmalig vor allen Tests */ });
  afterAll(() => { /* Einmalig nach allen Tests */ });
  
  beforeEach(() => { /* Vor jedem Test */ });
  afterEach(() => { /* Nach jedem Test */ });

  it('führt einen Test aus', () => {
    expect(true).toBe(true);
  });

  // Modifikatoren
  test.skip('wird übersprungen', () => {});
  test.only('führt nur diesen Test aus', () => {});
});

```

---

## 2. Häufige Matcher (`expect`)

### Werte & Gleichheit

* `expect(val).toBe(2)` — Strenger Vergleich (`===`, für Primitiven)
* `expect(obj).toEqual({a: 1})` — Tiefer Vergleich (Deep Equal für Arrays/Objekte)
* `expect(val).toBeDefined()` / `toBeUndefined()`
* `expect(val).toBeNull()`
* `expect(val).toBeTruthy()` / `toBeFalsy()`

### Zahlen & Strings

* `expect(val).toBeGreaterThan(5)`
* `expect(str).toContain('substring')`
* `expect(arr).toHaveLength(3)`
 
Rundungsfehler bei Floats abfangen
* `const sum = 0.1 + 0.2;`
* `expect(sum).toBeCloseTo(0.3);` - Prüft standardmäßig auf 2 Dezimalstellen genau
* `expect(sum).toBeCloseTo(0.3, 5);` - Oder mit präziserer Nachkommastellen-Angabe

### Fehler (Exceptions)

```javascript
expect(() => {
  throw new Error('Boom!');
}).toThrow('Boom!');

// Async
await expect(asyncFn()).rejects.toThrow('Error message');

```

---

## 3. Mocking & Spies (`vi` Helper)

Vitest bringt das `vi`-Objekt mit, das fast identisch zu Jest funktioniert.

### Spies & Funktionen (`vi.fn`)

```javascript
const spy = vi.fn();
spy('hallo');

expect(spy).toHaveBeenCalled();
expect(spy).toHaveBeenCalledWith('hallo');
expect(spy).toHaveBeenCalledTimes(1);

```

### Methoden-Spies (`vi.spyOn`)

```javascript
const user = {
  getName: () => 'Max'
};

const spy = vi.spyOn(user, 'getName').mockReturnValue('Erika');
console.log(user.getName()); // 'Erika'
spy.mockRestore();

```

### Module mocken (`vi.mock`)

```javascript
// Mockt ein komplettes Modul
vi.importMock('./api.js'); // oder direkt:
vi.mock('./api.js', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'mock' })
}));

```

### Timer & Datum mocken

```javascript
vi.useFakeTimers();
vi.setSystemTime(new Date(2026, 0, 1)); //

// Nach dem Test aufräumen
vi.useRealTimers();

```

---

## 4. Befehle im Terminal (CLI)

* `npx vitest` — Startet Vitest im interaktiven Watch-Modus.
* `npx vitest run` — Führt die Tests einmalig aus (CI-Modus).
* `npx vitest --ui` — Öffnet die grafische Benutzeroberfläche im Browser.
* `npx vitest --coverage` — Generiert einen Code-Coverage-Report.

## 5. Tests überspringen

Genau, `only` und `skip` sind super praktisch, um Tests gezielt zu steuern, wenn man an einer bestimmten Stelle debuggt oder feilt!

Du kannst sie direkt an `describe`, `it` oder `test` hängen:

### 1. `test.only()` (oder `it.only`)

Führt **nur** diesen einen Test (oder diesen Block) aus und ignoriert alle anderen im gesamten Testlauf. Das spart massig Zeit, wenn man sich auf ein einzelnes Problem konzentrieren will.

```javascript
it.only('should test only this specific feature', () => {
  expect(true).toBe(true);
});

```

### 2. `test.skip()` (oder `it.skip`)

Überspringt einen bestimmten Test (oder einen ganzen `describe`-Block) bewusst. Das ist ideal, wenn ein Test gerade fehlschlägt oder an einer Funktion gearbeitet wird, die noch nicht fertig ist.

```javascript
it.skip('should be skipped for now', () => {
  expect(true).toBe(false); // Fällt nicht auf, weil übersprungen
});

```

### Kombinierbar mit `describe`

Das Ganze funktioniert übrigens genauso für ganze Gruppen:

* `describe.only('...', () => { ... })`
* `describe.skip('...', () => { ... })`

Nutzt du die beiden oft direkt im Code beim Entwickeln, oder bist du gerade über einen bestimmten Anwendungsfall gestolpert?

## 6 Coverage (V8)

### Excluding

* `/* c8 ignore start`
* `/* c8 ignore stop`
* `/* c8 ignore next`
* `/* c8 ignore if`
* `/* c8 ignore else`
