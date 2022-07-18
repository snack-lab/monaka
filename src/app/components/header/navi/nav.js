import appConfig from "../../../appConfig.js";
import styles from "./nav.css" assert { type: "css" };

export default class NavElement extends HTMLElement {
  #root;
  #navilist = [
    { text: "Home", href: `${location.origin}${appConfig.appScope}` },
    { text: "About", href: "about.html" },
  ];

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
    <div class="header_nav">
    <nav>
      <ul>
      ${this.#navilist
        .map(
          (nav) => `
        <li><a href="${nav.href}">${nav.text}</a></li>
      `
        )
        .join("")}
      </ul>
    </nav>
    </div>
    `;
    return template.content.cloneNode(true);
  }
}
