# Frage
Wie erstelle ich eine Classe für Enums in JS?

## Antwort
### Beispiel:
```
/**
 * @enum {string}
 * Defines the types of control events dispatched by the color controller component.
 * 
 */
export const ControlEventType = Object.freeze({
  /** Triggered when the controller is initially loaded or reset. */
  INITIAL: "initial",
  /** Triggered when the base color is modified. */
  BASE_COLOR: "base-color",
  /** Triggered when the preview text content changes. */
  PREVIEW_TEXT: "preview-text",
  /** Triggered when the active font family is updated. */
  FONT_FAMILY: "font-family",
  /** Triggered when the hue slider value changes. */
  HUE: "hue",
  /** Triggered when the saturation slider value changes. */
  SATURATION: "saturation"
});

```
```
/**
 * @typedef {ControlEventType[keyof ControlEventType]} ControlEventValue
 * An Alias for the entries of enum ControlEventType 
 */

 /**
 * 
 * @typedef {object} OnChangeDetail Details payload dispatched with change events from the color controller.
 * @property {ControlEventValue} eventsource The source event type that triggered the change.
*/


```

