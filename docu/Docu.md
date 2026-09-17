Die offizielle WCAG-Kontrastformel lautet:

$$CR = \frac{L_1 + 0.05}{L_2 + 0.05}$$

Dabei ist $L_1$ die relative Luminanz der helleren Farbe und $L_2$ die relative Luminanz der dunkleren Farbe. Das Verhältnis $CR$ muss mindestens dem Zielwert (z. B. 4.5 für AA) entsprechen. Um die genaue Grenze zu berechnen, wird die Formel nach dem gesuchten Luminanzwert $L_{text}$ aufgelöst.

**Herleitung für Fall 1 (Text ist dunkler als der Hintergrund):**
Der Hintergrund ist in diesem Fall das hellere Element ($L_1 = L_{bg}$), und der Text ist das dunklere Element ($L_2 = L_{text}$):


$$4.5 = \frac{L_{bg} + 0.05}{L_{text} + 0.05}$$


Durch Umstellen der Gleichung nach $L_{text}$:


$$L_{text} + 0.05 = \frac{L_{bg} + 0.05}{4.5}$$

$$L_{text} = \frac{L_{bg} + 0.05}{4.5} - 0.05$$

**Herleitung für Fall 2 (Text ist heller als der Hintergrund):**
Der Text ist in diesem Fall das hellere Element ($L_1 = L_{text}$), und der Hintergrund ist das dunklere Element ($L_2 = L_{bg}$):


$$4.5 = \frac{L_{text} + 0.05}{L_{bg} + 0.05}$$


Durch Umstellen der Gleichung nach $L_{text}$:


$$L_{text} + 0.05 = 4.5 \times (L_{bg} + 0.05)$$

$$L_{text} = 4.5 \times (L_{bg} + 0.05) - 0.05$$

**Praxis-Hinweis zu den Grenzwerten:**
Da die relative Luminanz $L$ im Bereich von $0$ (absolutes Schwarz) bis $1$ (absolutes Weiß) liegt, liefern diese Formeln je nach Ausgangsfarbe auch Werte, die kleiner als 0 oder größer als 1 sein können. Das bedeutet mathematisch, dass der gewünschte Kontrast mit dieser Grundfarbe in die jeweilige Richtung (z. B. heller Text auf sehr hellem Hintergrund) schlicht nicht erreichbar ist – in diesem Fall muss die Richtung verworfen oder die Grundfarbe angepasst werden.

Deine Annahme und die beiden Formeln sind absolut korrekt.




Transparenz (Alpha) taucht in dieser Formel deshalb nicht auf, weil WCAG verlangt, dass du Farben vor der Kontrastberechnung immer auf einen vollflächigen, undurchsichtigen Hintergrund aufrechnest.

Eine transparente Farbe hat physikalisch keinen festen Kontrast – sie ändert sich schließlich sekündlich, je nachdem, was dahinter liegt. Deshalb kennt der reine WCAG-Algorithmus kein Alpha.

Wenn du mit Transparenzen (wie RGBA oder HSLA/OKLCH mit Alpha) arbeitest, musst du im ersten Schritt ein klassisches **Alpha-Blending (Compositing)** durchführen, um den tatsächlichen RGB-Farbwert zu ermitteln, der beim Menschen auf der Retina ankommt:

$$C_{final} = C_{foreground} \cdot \alpha + C_{background} \cdot (1 - \alpha)$$

Erst wenn diese Mischfarbe als solider Farbwert feststeht, wirfst du die genannte Formel für die relative Luminanz an.

Für dein Tool bedeutet das: Wenn du am Ende echte, lesbare Farbwerte (solid hex/oklch) ausspuckst, die der User direkt als Textfarbe nutzen kann, ist Alpha für die eigentliche Berechnung nach dem Compositing ohnehin raus. Wenn du aber planst, dass der User auch transparente Overlays wählen kann, müsstest du diesen Alpha-Mischschritt als Vorfilter vor die Binärsuche klemmen.



## Regex zur Listenzerlegung

```js
.split(/[,;\s]+/)
```
Erkärung: 
- '[]' - Zeichengruppe
- ','  - Komata
- ';'  - Semikolons
- '\s' - Leerzeichen

## import xxx from "yyy.css" with {type: 'css'}
Doch, natürlich! Du *kannst* (und musst bei Webpack oder Vite) genau diese Zusatztools und Loader installieren und konfigurieren.

Das Problem ist nicht, dass es unmöglich ist, sondern dass hier zwei Welten aufeinandertreffen: **Native Browser-Syntax** und **Bundler-Verarbeitung**.

* **Nativ im Browser:** Der Browser versteht `with { type: 'css' }` direkt und lädt die Datei als `CSSStyleSheet`.
* **Im Bundler (Webpack/Vite):** Bundler versuchen deinen Code zu analysieren, zu bündeln und zu optimieren. Wenn sie auf native Import-Attribute stoßen, stolpern sie standardmäßig darüber und brechen mit einem Syntaxfehler ab, weil sie diese Syntax ohne die passenden Loader/Plugins nicht verarbeiten können.

### Die Lösung für den Build-Prozess:

Wenn du Webpack oder Vite einsetzt, musst du die Tools entsprechend konfigurieren:

1. **Webpack:** Hier benötigst du den `css-loader` und musst ihn so einstellen, dass er das CSS als Constructable Stylesheet exportiert (z. B. mit der Option `exportType: "css-style-sheet"`).
2. **Vite:** Vite nutzt für solche Fälle standardmäßig eigene Wege (wie den Query-Parameter `?inline` oder `.module.css`), weshalb es native Import-Asserts oft blockiert, es sei denn, man greift zu speziellen Plugins.

Das bedeutet: Du kannst die Tools problemlos nutzen, musst dann aber meistens deren projektspezifische Import-Syntax verwenden (oder die Loader explizit auf die native Syntax anpassen), statt den Code rein für den Browser zu schreiben.

Wie ist dein Build-Prozess für die Zukunft aufgesetzt – planst du eher mit Webpack oder mit Vite zu arbeiten?