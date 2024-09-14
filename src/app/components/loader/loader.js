import sheet from "./loader.css" with { type: "css" };

// Todo popoverに変更
class LoaderElement extends HTMLElement {
  #root;

  static get observedAttributes() {
    return ["toggle"];
  }

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.adoptedStyleSheets.push(sheet);
    this.#root.appendChild(this.#template());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "toggle") {
      const l = this.#root.querySelector(".loader");
      l.classList.remove("on");
      if (newValue === "show") {
        l.classList.add("on");
      }
    }
  }

  #template = () => {
    const template = document.createElement("template");
    const html = `<div class="loader"><div class="spinner"></div></div>`;
    template.setHTMLUnsafe(html);
    return template.content.cloneNode(true);
  };
}

customElements.define("m-loader", LoaderElement);
