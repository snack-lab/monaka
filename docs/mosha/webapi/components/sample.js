
export class SampleElement extends HTMLElement {

  #root;
  #name = "";

  static get observedAttributes() {
    // 観測属性定義
    return ['name'];
  }

  constructor() {
    super();
    console.debug('constructor');
    this.#root = this.attachShadow({mode: 'open'});
    this.#root.appendChild(this.#template().content.cloneNode(true));
  }

  connectedCallback() {
    // ドキュメントに接続されるたび
    console.debug('connectedCallback');
  }

  disconectedCallback() {
    // DOMから切断されるたび
    console.debug('disconnectedCallback');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //スタム要素の属性の1つが追加、削除、または変更されるたび
    console.debug(`attributeChangedCallback ${name}:${oldValue}->${newValue}`);

    if (name === "name") {
      this.#name = newValue;
      const nm = this.#root.querySelector('span');
      nm.textContent = this.#name;
    }
  }

  adoptedCallback(oldDocument, newDocument) {
    //カスタム要素が新しいドキュメントに移動するたび
    console.debug(`adoptedCallback ${oldDocument}->${newDocument}`);
  }

  #template() {
    const template = document.createElement('template');
    template.innerHTML = `<span>${this.#name}</span>`;
    return template;
  }
}

customElements.define('m-sample', SampleElement);
