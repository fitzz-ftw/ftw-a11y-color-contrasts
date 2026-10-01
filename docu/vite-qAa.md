# Frage
Eine Frage zu `vite`: Die Dateien im `assets`-Verzeichnis werden nur eingebunden wenn sie importiert werden, die im `public` werden immer copiert?


## Antwort
Genau, das hast du perfekt auf den Punkt gebracht! So verhält sich Vite bei diesen beiden Verzeichnissen:

* **Das `assets`-Verzeichnis (bzw. importierte Dateien):**
  * Dateien hier werden von Vite verarbeitet (optimiert, mit Hashes versehen etc.).
  * Sie werden **nur** dann in den finalen Build-Ordner übernommen und ausgeliefert, wenn sie aktiv im Code (z. B. via `import` in JavaScript oder direkt in CSS/HTML) referenziert bzw. importiert werden.


* **Das `public`-Verzeichnis:**
  * Dateien hier werden **immer** 1:1 in das Root-Verzeichnis des Build-Outputs kopiert – völlig egal, ob sie im Code aufgerufen werden oder nicht.
  * Sie behalten auch ihren originalen Dateinamen (ohne Hash). Das ist ideal für Dinge wie `favicon.ico`, `robots.txt` oder statische Dateien, die über einen festen, unveränderten Pfad erreichbar sein müssen.
