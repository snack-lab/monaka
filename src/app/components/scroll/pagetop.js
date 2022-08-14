import styles from "./pagetop.css" assert { type: "css"}

export default class PageTopElement extends HTMLElement {
  #root;

  // 観測属性定義
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.#root = this.attachShadow({mode : "closed"});
    this.#root.adoptedStyleSheets.push(styles);
    this.#root.appendChild(this.#template());

    const btn = this.#root.querySelector("#page-top");
    btn.onclick = (event) => {
      window.scroll({top: 0, behavior: 'smooth'});
    }
  }

  /**
   * ドキュメントに接続時
   */
  connectedCallback() {
    const btn = this.#root.querySelector("#page-top");
    window.onscroll = (event) => {
      if (window.pageYOffset > 400) {
        if (!btn.classList.contains('visible')) {
          btn.classList.add('visible')
        }
      } else {
        if (btn.classList.contains('visible')) {
          btn.classList.remove('visible')
        }
      }
    }
  }

  /**
   * DOM からの切断自
  */
  disconnectedCallback() {
    console.debug(`disconnectedCallback`);
  }

  /**
   * カスタム要素が新しいドキュメントに移動時
   */
  adoptedCallback() {
    console.debug(`adoptedCallback`);
  }

   /**
    * 属性追加、削除、変更時
    *
    * @param {*} name 属性名
    * @param {*} oldValue 旧属性値
    * @param {*} newValue 新属性値
    */
    attributeChangedCallback(name, oldValue, newValue) {
    }

    #template = () => {
      const template = document.createElement('template');
      template.innerHTML = `<button id="page-top">PAGE TOP</button>`;

      return template.content.cloneNode(true);
    }
}
