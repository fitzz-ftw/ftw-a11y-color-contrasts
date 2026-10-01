Hier ist eine kompakte und übersichtliche Anleitung für dein lokales Entwicklungs-Setup mit Vite, `npm link` und der Besonderheit bei `peerDependencies` (wie im Projekt mit `culori` erforderlich).

---

## Lokales Entwicklungs-Setup mit `npm link` & Vite

### 1. Vorbereitung der Bibliothek (Library)

Damit eine Bibliothek lokal verknüpft werden kann, muss sie zunächst registriert und gebaut werden:

* **Global verknüpfen:** Gehe in das Wurzelverzeichnis deiner Bibliothek und führe folgenden Befehl aus, um sie im globalen npm-Registry-Cache zu registrieren:
```bash
npm link

```


* **Build-Prozess starten:** Falls deine Bibliothek einen Build-Schritt (z. B. via Vite) benötigt, starte am besten den Watch-Modus oder baue direkt neu:
```bash
npm run build

```



### 2. Einbindung im Konsumenten-Projekt

Wechsle nun in das Projekt, das die Bibliothek nutzen soll (z. B. deine Web-App oder das Test-Repository):

* **Verknüpfung herstellen:** Verknüpfe die global registrierte Bibliothek lokal in deinem Projekt:
```bash
npm link <name-deiner-bibliothek>

```



---

### Wichtige Besonderheit: Das `peerDependencies`-Dilemma

Wenn deine Bibliothek eine externe Abhängigkeit als **`peerDependency`** definiert (wie z. B. `culori`), gibt es bei der Nutzung von `npm link` einen bekannten Stolperstein:

* **Das Problem:** npm verlinkt die Bibliothek zwar korrekt in den `node_modules`-Ordner des Konsumenten-Projekts, allerdings wird die `peerDependency` oft aus Sicht des *Konsumenten* aufgelöst oder im Pfad der verlinkten Library doppelt/falsch gesucht, was zu Modul-Ladefehlern (z. B. *Module not found* oder Instanz-Konflikten) führen kann.
* **Die Lösung:**
1. Stelle sicher, dass die `peerDependency` (z. B. `culori`) im Konsumenten-Projekt **direkt installiert** ist (`npm install culori`).
2. Falls Vite die verlinkte Bibliothek im monorepo-ähnlichen Setup nicht korrekt auflöst, hilft es oft, in der `vite.config.mjs` des Konsumenten-Projekt die Auflösung explizit abzusichern oder den Build der Library (`npm run build`) direkt greifen zu lassen, damit die Änderungen sofort im Dev-Server / Build-Ergebnis des Konsumenten landen.