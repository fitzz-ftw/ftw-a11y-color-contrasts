----

# A11y Color Components

A lightweight, framework-agnostic web component library for selecting WCAG-compliant accessible color pairs based on robust HSL contrast calculations.

## Why Use This?

* **WCAG Compliance:** Instantly select and verify color combinations that meet strict accessibility contrast guidelines.
* **Hue Persistence:** Prevents achromatic collapse during desaturation states and edge transitions.
* **Zero Framework Bloat:** Built with native Web Components and vanilla JavaScript for seamless integration into any workflow.

## Usage

``` html
<script type="module" src="https://esm.sh/a11y-color-components"></script>

<a11y-color-control for="acc1 acc2" ></a11y-color-control>

<a11y-color-card id="acc1" mode="darker" wcag-mode="AAA">
<a11y-color-card id="acc2" mode="darker" wcag-mode="AAA" font-mode="bold">

```

## Tag: **`<a11y-color-control>`**

### HTML Arguments

| Argument |  Default | Description |
| --- |  :---: | --- |
| `for` |  `""` | List of IDs of `<a11y-color-cards>` it is connected to and updates it. |
|`initial-color`|"#18fbf8"|The color when initialized|
|`initial-preview-text`|"Accessibility sample text"|Initial text displayed in the color preview element.|

### Events

| Event Name | Detail | Description |
| --- | --- | --- |
| `config-change` | Whole data with new and old values | Dispatched when a change is done. |


##  Tag: **`<a11y-color-card>`**
### HTML Arguments

| Argument |  Default | Description |
| --- |  :---: | --- |
|`id`||Required to connect to an controller|
|`initial-color`|"#18fbf8"|The color when initialized, will be overiden by controler color, when connected to a controler|
|`mode`|"darker"| Defines the contrast direction (e.g., `darker` or `lighter`) relative to the base color to meet the WCAG target. |
|`wcag-mode`| "AA" | The WCAG standard, possible values: `AA`\|`AAA`|
|`font-mode`| "normal" |The WCAG standard declares three font modes: `normal`\|`bold`\|`large`|

### Events
No events dispatched.

----
## License

### ISC
Copyright 2026 Fitzz TeXnik Welt

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.