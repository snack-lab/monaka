import LogoElement from "./logo/logo.js";
import NavElement from "./navi/nav.js";

import styles from "./header.css" assert { type: "css" };

customElements.define("m-logo", LogoElement);
customElements.define("m-nav", NavElement);

export default class HeaderElement extends HTMLElement {
  #root;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
    this.#root.adoptedStyleSheets.push(styles);
    this.#root.appendChild(this.#template());
  }

  connectedCallback() {
    if ("windowControlsOverlay" in navigator) {
      console.log("supported window controls overlay");
    }
  }
  #template() {
    const template = document.createElement("template");
    template.innerHTML = `
    <header class="header">
      <m-logo></m-logo>
      <m-nav class="nv"></m-nav>
    </header>
    `;

    return template.content.cloneNode(true);
  }
}
