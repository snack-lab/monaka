import sheet from "./pagetop.css" with { type: "css" };

// Todo popoverに変更
class PageTopElement extends HTMLElement {
  #root;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.adoptedStyleSheets.push(sheet);
    this.#root.appendChild(this.#template());

    const btn = this.#root.querySelector("#page-top");
    btn.onclick = () => window.scroll({ top: 0, behavior: "smooth" });
  }

  connectedCallback() {
    const btn = this.#root.querySelector("#page-top");
    window.onscroll = () => {
      if (window.scrollY > 400) {
        if (!btn.classList.contains("visible")) {
          btn.classList.add("visible");
        }
      } else {
        if (btn.classList.contains("visible")) {
          btn.classList.remove("visible");
        }
      }
    };
  }

  #template = () => {
    const template = document.createElement("template");
    const html = `<button id="page-top">PAGE TOP</button>`;
    template.setHTMLUnsafe(html);
    return template.content.cloneNode(true);
  };
}

customElements.define("m-pagetop", PageTopElement);
