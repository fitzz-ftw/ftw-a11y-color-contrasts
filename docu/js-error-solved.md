# Frage
``` js
const [key, value] = control.getCardStatuses().entries().next().value ?? [];
```
Krass, nur um ans erste element zu kommen. fürs zweite dann 2 mal next(), oder kennt next einen Parameter?

## Antwort
Nein, `next()` nimmt leider keinen Index-Parameter (der Parameter dort ist technisch bedingt für die Kommunikation mit Generatoren gedacht).

Noch viel wichtiger: Da deine Methode `getCardStatuses()` jedes Mal eine **komplett neue Map** zurückgibt, würdest du mit zwei getrennten Aufrufen (z. B. einmal `.next()` und in der nächsten Zeile nochmal) jedes Mal nur das *erste* Element von zwei verschiedenen Map-Instanzen bekommen!

Wenn du gezielt an das erste, zweite oder n-te Element möchtest, ist der Weg über ein Array (einmal umwandeln) im Test oder Code tausendmal lesbarer und stabiler:

```javascript
const entries = Array.from(control.getCardStatuses().entries());
const [firstKey, firstVal] = entries[0] ?? [];
const [secondKey, secondVal] = entries[1] ?? [];

```

Das spart dir den Iterator-Kram und du kannst ganz normal per Index (`0`, `1`, etc.) zugreifen, falls du das für Assertions in Tests brauchst!

# Frage
Ich habe folgendes Problem:
``` js
    /** @type {string} */
    let key
    /** @type {boolean} */
    let valueB
[key, valueB] = control.getCardStatuses().entries().next().value ?? [];
```

## Antwort
Das Problem liegt hier am TypeScript-Typensystem (bzw. JSDoc-Typisierung im Zusammenschluss mit dem Nullish Coalescing `?? []`).

Weil `next().value` theoretisch auch `undefined` sein kann und das `?? []` ein leeres Array vom Typ `never[]` (oder `any[]`) liefert, meckert der Typchecker, dass ein Array von `unknown` oder `any` nicht destructuring-kompatibel auf `string` und `boolean` gemappt werden kann, oder weil `value` undefiniert sein könnte.

Am saubersten und typsichersten löst man das, indem man die Map vorher einmal kurz in ein Array umwandelt (wie eben besprochen). Dann meckert auch der Checker nicht mehr:

```javascript
    /** @type {string} */
    let key;
    /** @type {boolean} */
    let valueB;

    const entries = Array.from(control.getCardStatuses().entries());
    [key, valueB] = entries[0] ?? [/* default key */ '', false];

```

Oder, wenn du sicher bist, dass Einträge da sind und du den Typ-Ärger umgehen willst, direkt über den Index:

```javascript
    const firstEntry = Array.from(control.getCardStatuses().entries())[0];
    /** @type {string} */
    const key = firstEntry?.[0] ?? '';
    /** @type {boolean} */
    const valueB = firstEntry?.[1] ?? false;

```

Damit weiß der Editor exakt, welchen Typ die Variablen haben, und du stolperst über keine Iterator- oder Destructuring-Typenkonflikte mehr!

# Frage
```
TypeError: Cannot set properties of undefined (setting 'undefined')
 ❯ src/components/components.test.js:76:19
     74|     expect(testCard.exampleText).toBe("Hallo World")
     75|     console.log(control.getCardStatuses())
     76|     [key, valueB] = control.getCardStatuses().entries().next().value ?? [/* default key */ '', false];
       |                   ^
     77|     expect(key).toBe("card-1")
     78|     expect(valueB).toBe(true)
```
Also so geht es nicht.

## Antwort
Das hat einen klassischen und extrem heimtückischen Grund in JavaScript: **Ein fehlendes Semikolon in der Zeile davor (ASI – Automatic Semicolon Insertion).**

Schau dir mal deine Zeilen 75 und 76 an:

```javascript
75|     console.log(control.getCardStatuses())
76|     [key, valueB] = control.getCardStatuses().entries().next().value ?? [];

```

Weil Zeile 75 **kein Semikolon** hat, klebt JavaScript Zeile 76 direkt an das Ende von Zeile 75 heran. Für den Parser sieht das so aus:

```javascript
console.log(control.getCardStatuses())[key, valueB] = ...

```

Da `console.log(...)` den Wert `undefined` zurückgibt, versucht JavaScript buchstäblich, eine Eigenschaft auf `undefined` zu setzen (`undefined[...]`). Das wirft genau diesen mysteriösen `TypeError: Cannot set properties of undefined`.

### Die Lösung:

Setze ein Semikolon hinter den `console.log` (oder schmeiß den `console.log` ganz raus):

```javascript
    console.log(control.getCardStatuses());
    [key, valueB] = control.getCardStatuses().entries().next().value ?? ['', false];

```

Oder noch sauberer direkt beim Deklarieren per `const`:

``` javascript
    const firstEntry = control.getCardStatuses().entries().next().value;
    const key = firstEntry?.[0] ?? '';
    const valueB = firstEntry?.[1] ?? false;

```

Mit dem Semikolon (oder der `const`-Variante) sollte der Test sofort durchlaufen!
