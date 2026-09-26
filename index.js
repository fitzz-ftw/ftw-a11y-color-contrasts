// @ts-check


import { HTMLA11yColorCard } from "./src/components/color-card/HtmlA11yColorCard.js";
customElements.define("a11y-card", HTMLA11yColorCard);
import { HTMLColorControl } from "./src/components/color-controler/HtmlColorControl.js";
customElements.define("a11y-control", HTMLColorControl);



// import { ColorContrastPairs } from "./src/utils/ColorContrastPair.js";
// import { hsl, formatHex } from "culori";

// const control =/** @type {HTMLA11yColorCard} */(document.getElementById("a11y-ctrl"));

// control.curColor = "#000000";

// // const x = hsl("#333333")
// const x = hsl("#1e1e1e")
// // const y = hsl("#2a2a2a")
// const y = hsl("#444")

// console.log("x", x, "y", y)
// console.log("x", formatHex(x), "y", formatHex(y))

// const res = ((100 / x.l) * y.l) / 100

// console.log("res:", res, x.l * res)

// const num = 2.2666666666666666

// let t = x
// // t.l *= 1.4
// t.l *= num

// console.log("css:",
//   formatHex(t),
//   // (x.l * 1.4)
//   (t.l),
//   (x.l * num),
//   hsl()
// )


// /**
//  * Description placeholder
//  *
//  * @type {NodeListOf<HTMLA11yColorCard>}
//  */
// const colorCards = document.querySelectorAll("a11y-card")
// const a11yControl = /** @type {HTMLColorControl} */(document.getElementById("a11y-ctrl"))
// a11yControl.addEventListener("config-change", (event) => {
//   const e = /** @type {CustomEvent} */(event)
//   const detail = /** @type {import("./HTMLColorControl.js").OnChangeDetail} */(e.detail)
//   // console.log(e)
//   // console.log(e.detail)
//   if (detail.eventsource == ControlEventType.INITIAL) {
//     console.log("Initial")
//   }
//   const esrc = detail.eventsource
//   const typ = ControlEventType

//   colorCards.forEach((item) => {
//     if (esrc == typ.HUE) {
//       const newHue = /** @type {string} */(detail.hue.new)
//       item.hue = newHue
//       return

//     }
//     if (esrc == typ.SATURATION) {
//       const newSat = /** @type {string} */(detail.sat.new)
//       item.sat = newSat
//       return
//     }


//     if (esrc == typ.BASE_COLOR || esrc == typ.INITIAL) {
//       const newColor = /** @type {string} */(detail.color.new)
//       item.curColor = new ColorContrastPairs(newColor)
//       // item.updateUI()
//     }
//     if (esrc == typ.PREVIEW_TEXT || esrc == typ.INITIAL) {
//       const newText = /** @type {string} */(detail.text.new)
//       console.log(newText)
//       item.exampleText = newText


//     }
//     if (esrc == typ.FONT_FAMILY || esrc == typ.INITIAL) {
//       const newfont = /** @type {string} */(detail.font.new)
//       console.log(JSON.parse(newfont))
//       item.previewFont = newfont

//     }



//   })
// })
