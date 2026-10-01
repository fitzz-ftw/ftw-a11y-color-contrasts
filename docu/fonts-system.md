Das ist ein hervorragender Punkt für die Dokumentation. Wenn es um die Komponente für die Schriftauswahl oder das Vorschau-Layout geht, hilft ein klarer Hinweis ungemein, Missverständnisse von vornherein auszuschließen.

Ich empfehle, das in der Dokumentation etwa so zu formulieren:

---

### **Hinweis zur Schriftauswahl & Corporate Identity (CI)**

* **Feste CI-Schriften über `@font-face`:** Für ein konsistentes und plattformunabhängiges Erscheinungsbild im Sinne der Corporate Identity sollten spezifische Schriftarten direkt lokal im Projekt eingebunden werden (z. B. via `@font-face` im CSS). Dadurch wird sichergestellt, dass die Darstellung und die Kontrastberechnungen auf jedem System identisch ausfallen.
* **Verzicht auf die *Local Font Access API*:** Da die Verfügbarkeit von Systemschriften von Gerät zu Gerät stark variiert (und die API zum Auslesen lokaler Fonts von Browsern wie Firefox oder Safari aus Datenschutzgründen blockiert bzw. nicht unterstützt wird), setzt die Komponente auf definierte Font-Stacks bzw. geladene Webfonts statt auf eine dynamische Systemabfrage.

---

Soll ich dir diesen Block direkt so für deine Dokumentation (oder den Markdown-Bereich deines aktuellen Projekts) vormerken?

# Englisch
Hier ist die Dokumentation für das Font-Family-Select in einfachem Englisch, direkt bereit zum Einfügen:

---

### **Note on Font Selection & Corporate Identity (CI)**

* **Fixed CI Fonts via `@font-face`:** For a consistent and platform-independent appearance aligned with your Corporate Identity, specific fonts should be bundled directly within the project (e.g., using `@font-face` in your CSS). This ensures that the visual presentation and contrast calculations remain identical across all systems.
* **Avoiding the *Local Font Access API*:** Because the availability of local system fonts varies heavily from device to device—and browsers like Firefox and Safari restrict or do not support the API for privacy reasons—the component relies on predefined font stacks or loaded web fonts rather than dynamic system queries.