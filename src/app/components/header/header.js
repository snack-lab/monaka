import "../install/install.js";
import "../search/search.js";
import "../fullscreen/fullscreen.js";

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

    const list = [
      { content: `<li><m-search></m-search</li>` },
      { content: `<li><m-fullscreen></m-fullscreen</li>` },
      { content: `<li><a href="./about.html">Abount</a></li>` },
      { content: `<li><m-install></m-install></li>` },
    ]

    const html = `
      <header class="header">
        <h1><a href="/monaka">Monaka</a></h1>
         <nav>
           <ul>
              ${list.map(item => item.content).join('')}
           </ul>
         </nav>
      </header>
    `;
    template.setHTMLUnsafe(html);
    return template.content.cloneNode(true);
  }
}

customElements.define("m-header", HeaderElement);
