# Frage
Also gäbe es einen JSonly Würgaround, eine Einstigspunkt der eine Klasse, Funktion exportiert, in der Alle im Project enthaltenen Klassen und Funktionen sind und das nur über console.log "Hallo Welt!" ausgibt.

## Antwort
Ja, absolut! Das wäre im Grunde ein zentraler Fassaden- oder Aggregator-Einstiegspunkt (oft als `index.js` oder `all.js` im Quellverzeichnis), der alle anderen Module einsammelt und bündelt.

Wenn dieser Einstiegspunkt dann beispielsweise so aussieht:

```javascript
// docssrc/index.js
import * as ModuleA from './moduleA.js';
import * as ModuleB from './moduleB.js';

export { ModuleA, ModuleB };

export function halloWelt() {
    console.log("Hallo Welt!");
}

```

...hast du damit für TypeDoc (und den TypeScript-Compiler) genau das erreicht, was sie brauchen:

1. **Ein klarer Entry Point:** TypeDoc muss nicht mehr über wilde Glob-Patterns raten, sondern füttert sich sauber von diesem einen zentralen Knotenpunkt aus.
2. **Kette der Referenzen:** Da dieser Einstiegspunkt alle anderen Module importiert und (zumindest teilweise oder als Namespace) exportiert, zieht der Compiler den gesamten Baum dahinter auf.
3. **Keine verwaisten Dateien:** Dadurch hängen plötzlich alle deine Klassen und Funktionen im AST-Baum fest und werden erfasst, anstatt als unreferenzierter Code ignoriert zu werden.

Der Charme daran: Man zwingt TypeDoc über einen sauberen JavaScript-Standardweg zur Mitarbeit, ohne dass man zwingend jede einzelne Datei im Quellcode vorab mit `export` vollschreiben muss – vorausgesetzt, man pflegt diesen zentralen Aggregator.

# Frage
Das ist klar, die Pflege hält sich aber auch in Grenzen. Ich muss die einzelnen Klassen, Funktionen nicht irgendwo verwenden, das sie ausgegeben werden? Das da oben reicht Dann brauchts ja noch nicht mal eine Funktion da drin.

## Antwort
Genau so ist es! Du musst sie im eigentlichen Code-Flow nicht aktiv aufrufen oder verwenden. Es reicht rein für den Parser aus, dass sie **importiert** (oder re-exportiert) werden, damit TypeDoc sie als Teil des Abhängigkeitsbaums erkennt.

Und du hast vollkommen recht: Eine Funktion mit `console.log` braucht man dafür nicht einmal. Ein reines Bündeln und Re-Exportieren reicht völlig aus, zum Beispiel so:

```javascript
// docssrc/index.js
export * from './modulA.js';
export * from './modulB.js';
// usw.

```

Mit diesem simplen `export * from ...`-Ansatz zieht TypeDoc beim Durchlauf alle Symbole aus den angegebenen Dateien mit in die Dokumentation, ohne dass du im eigentlichen Projektcode händisch eingreifen musst oder dort Funktionsaufrufe brauchst.