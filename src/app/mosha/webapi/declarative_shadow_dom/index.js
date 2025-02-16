// https://web.dev/articles/declarative-shadow-dom

class Sample extends HTMLElement {

  constructor() {
    super();
    const declarative = this.supportsDSD();
    const internals = declarative ? this.attachInternals() : undefined;
    let shadow = internals?.shadowRoot;

    if (!shadow) {
        shadow = this.attachShadow({mode: "open",});
        shadow.innerHTML = `<button><slot></slot></button>`;
      }
  }

  supportsDSD = () => {
    return HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode');
  }
}

customElements.define("m-sample", Sample);
