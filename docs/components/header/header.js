import "../install/install.js";

import sheet from "./header.css" with { type: "css" };

class HeaderElement extends HTMLElement {
  #root;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.adoptedStyleSheets.push(sheet);
    this.#root.appendChild(this.#template());
  }

  #template = () => {
    const template = document.createElement("template");
    const html = `
      <header class="header">
        <h1><a href="/monaka">Monaka</a></h1>
         <nav>
           <ul>
             <li><a href="./about.html">Abount</a></li>
             <li><m-install></m-install></li>
           </ul>
         </nav>
      </header>
    `;
    template.setHTMLUnsafe(html);
    return template.content.cloneNode(true);
  }
}

customElements.define("m-header", HeaderElement);
