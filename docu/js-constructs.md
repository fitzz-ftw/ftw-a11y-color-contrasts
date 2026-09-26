# Frage
Ok, ein paar fragen zum Map: wie komme ich an das erste Paar, respektive exakt ein Paar, wobei ich key und value brauche. 

## Antwort
Um an das erste Paar (Schlüssel und Wert) einer Map heranzukommen, gibt es in JavaScript ein paar extrem saubere Wege.

### 1. Per Destructuring und Iterator (`.entries().next()`)

Das ist der direkteste und performanteste Weg, ohne das ganze Objekt umwandeln zu müssen:

```javascript
const iterator = myMap.entries();
const firstEntry = iterator.next().value; 

if (firstEntry) {
  const [key, value] = firstEntry;
  console.log(key, value);
}

```

Oder noch kompakter in einer Zeile:

```javascript
const [key, value] = myMap.entries().next().value ?? [];

```

### 2. Per Array-Destructuring (mit `Array.from`)

Wenn du ohnehin schon mit Arrays arbeitest oder es besonders lesbar haben möchtest:

```javascript
const [[key, value]] = Array.from(myMap.entries());

```

*(Achtung: Wenn die Map komplett leer ist, wirft das einen Fehler beim Destructuring, weil `undefined` nicht destrukturiert werden kann. Wenn die Map leer sein könnte, nimm lieber Variante 1 mit Fallback).*

### 3. Per `for...of` (wenn du einfach nur *das erste* greifen und abbrechen willst)

```javascript
let firstKey, firstValue;
for (const [key, value] of myMap.entries()) {
  firstKey = key;
  firstValue = value;
  break; // Direkt beim ersten Element stoppen
}

```

Für Tests (z. B. um zu prüfen, ob der Status korrekt gesetzt ist) ist die erste Variante mit `.entries().next().value` meistens am elegantesten.

# Frage
const [key, value] = control.getCardStatuses().entries().next().value ?? [];
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