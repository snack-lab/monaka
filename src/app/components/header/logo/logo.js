import appConfig from "../../../appConfig.js";
import styles from "./logo.css" assert { type: "css" };
export default class LogoElement extends HTMLElement {
  #root;
  siteName = "Monaka";

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.adoptedStyleSheets.push(styles);
    this.#root.appendChild(this.#template());
  }

  connectedCallback() {}

  #template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <h1 class="logo">
        <a href="${location.origin}${appConfig.appScope}">${this.siteName}</a>
      </h1>
    `;

    return template.content.cloneNode(true);
  }
}
