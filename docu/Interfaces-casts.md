# Frage
In Python hätten wir da jetzt ein Protokoll definiert, gibt es sowas in JS auch? Es ist ja vieleicht ein Interface, Aber kann man das dann auch casten?

## Antwort
In JavaScript (bzw. genauer gesagt in der statischen Analyse via JSDoc / TypeScript) gibt es dafür zwei sehr mächtige Werkzeuge: **@typedef** (für Struktur-Verträge, die Python-Protokollen entsprechen) und **Typ-Casting** mittels Klammer-Syntax.

Lass uns das aufschlüsseln:

### 1. Das Äquivalent zum Python-Protokoll: Strukturelle Typisierung (`@typedef`)

In Python definierst du mit `typing.Protocol` einen strukturellen Typ (Duck Typing). In JSDoc machst du exakt dasselbe, indem du dir ein eigenes Interface oder einen Typ via `@typedef` definierst.

Da JavaScript zur Laufzeit keine Interfaces kennt, prüft der TypeScript-Checker nur zur Entwicklungszeit, ob das Objekt die Struktur erfüllt.

```javascript
/**
 * @typedef {Object} FontLike
 * @property {string} family
 * @property {string} [style]
 */

/**
 * @param {Iterable<FontLike>} fontSource
 */

```

Das entspricht exakt einem Python-Protokoll: Jedes Objekt, das `family` (und optional `style`) besitzt, passt – ganz ohne `implements`-Zwang.

---

### 2. Kann man in JSDoc / JS auch casten?

**Ja, absolut.** Wenn der Typ-Checker meckert, weil ein Objekt für ihn zu vage ist (z. B. ein `unknown`, `any` oder ein generisches `Object`), kannst du es explizit casten.

In JSDoc sieht das so aus: Du schreibst das `@type`-Cast vor den Ausdruck und setzt diesen in Klammern:

```javascript
// Beispiel für einen Cast in JSDoc:
const myFont = /** @type {FontLike} */ (rawObjectFromSomewhere);

```

Das zwingt den Checker dazu, das Objekt ab dieser Stelle als den angegebenen Typ zu behandeln – genau wie `typing.cast()` in Python oder ein Type-Assertion (`as FontLike`) in TypeScript.

# Frage
Ja, das benutze ich ja schon beides, aber Nehmen wir an ich würde fontlike erstellen und damit hantieren und es später wieder rausgeben, wie sieht es aus wenn ich FontFaces übergeben habe und will sie vieleicht nur Sortieren um sie dann zurüchzugeben, kann ich dann auch wieder mit /** @type {FontFace} */() wieder darauf als Fontface zugreifen?

## Antwort
Genau so ist das! Wenn du ein Objekt hast, das durch eine breitere Typisierung (wie unseren Duck-Typing-Ansatz oder einen Union-Typ) läuft, und du möchtest an einer bestimmten Stelle wieder auf die vollen `FontFace`-Eigenschaften zugreifen, kannst du exakt diesen Cast verwenden:

```javascript
const nativeFace = /** @type {FontFace} */ (item);
// Jetzt weiß der Checker wieder, dass es ein FontFace ist, 
// und erlaubt z. B. native Methoden oder spezifische Properties.

```

### Wie verhält sich das im Detail?

1. **Rein zur Compile-Zeit:** Der JSDoc-Cast `/** @type {TargetType} */(expression)` ist reine Magie für den statischen Analysator (TypeScript-LSP im Editor). Zur Laufzeit passiert dadurch absolut gar nichts – JavaScript führt zur Laufzeit ohnehin keine Typüberprüfungen durch. Wenn zur Laufzeit also ein echtes `FontFace` übergeben wurde, bleibt es das auch. Der Cast sagt dem Editor lediglich: *"Vertrau mir, behandle dieses Objekt ab hier wieder als `FontFace`."*
2. **Der elegante Weg über Generics:** Wenn du eine Funktion schreibst, die Elemente entgegennimmt und (in ähnlicher Form oder unverändert) weiterreicht, kannst du in JSDoc auch mit **Generics** (`@template`) arbeiten. Damit behält der Typ-Checker den exakten Typ bei, den du reingesteckt hast, ganz ohne manuelles Casten:

```javascript
/**
 * @template {FontFace | { family: string, style?: string }} T
 * @param {Iterable<T>} fontSource
 * @returns {Array<T>}
 */
function processFonts(fontSource) {
  // Der Typ von 'item' bleibt hier exakt der, den der Aufrufer reingesteckt hat!
  for (const item of fontSource) {
    // ...
  }
}

```

Mit einem Template-Parameter weiß der Checker automatisch: *"Ah, wenn jemand ein echtes `FontFace`-Array reingibt, kommt nachher auch wieder der genaue `FontFace`-Typ heraus."* Wenn du aber flexibel mischst (Mocks + echte Instanzen), ist der explizite Cast `/** @type {FontFace} */(...)` genau das richtige Werkzeug, um dem Checker im Code-Block den Weg zu weisen.

# Frage
Wie ist die Typenauflösung beim Getter?

## Antwort
Der Type wird wi folgt aufgelöst:
1. der Type der Variablen vom getter
  ```js
  get name(){ return this.variable}
  set name(value){this.variable = value}
  ```
2. der Type des Parameters des Setters
  ```js
  get name(){ return this.variable}
  /** @param {type1} value */
  set name(value){this.variable = value}
  ```
3. der explezite Rückgabetyp des Getters
  ```js
  /** @returns {type2} */
  get name(){ return this.variable}
  /** @param {type1} value */
  set name(value){this.variable = value}
  ```
