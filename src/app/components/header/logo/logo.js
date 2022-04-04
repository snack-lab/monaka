import config from "../../../js/config.json" assert { type: "json" };
import styles from "./logo.css" assert { type: "css" };
export default class LogoElement extends HTMLElement {
  #root;
  siteName = "Monaka";

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
    this.#root.adoptedStyleSheets.push(styles);
    this.#root.appendChild(this.#template());
  }

  connectedCallback() {}

  #template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <h1 class="logo">
        <a href="${location.origin}${config.app_scope}">${this.siteName}</a>
      </h1>
    `;

    return template.content.cloneNode(true);
  }
}
