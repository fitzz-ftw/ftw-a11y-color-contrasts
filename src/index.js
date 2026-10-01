import { HTMLA11yColorCard } from "./components/color-card/HtmlA11yColorCard";
import { HTMLColorControl } from "./components/color-controler/HtmlColorControl";

if (!customElements.get('a11y-color-card')) {
  customElements.define('a11y-color-card', HTMLA11yColorCard);
}
if (!customElements.get('a11y-color-control')) {
  customElements.define('a11y-color-control', HTMLColorControl);
}
