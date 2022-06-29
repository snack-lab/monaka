
import styles from "./install.css" assert { type: "css"};

export default class InstallButtonElement extends HTMLElement {
  #root;
  #deferredPrompt;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.adoptedStyleSheets.push(styles);
    this.#root.appendChild(this.#template);

    const btn = this.#root.getElementById("iBtn");
    btn.addEventListener('click', async (e) => {
      this.#deferredPrompt.prompt();

      const { outcome } = await this.#deferredPrompt.userChoice;

      console.log(`User response to the install prompt: ${outcome}`);

      if (outcome === "dismissed") {
        this.#deferredPrompt = null;
      }
    });
  }

  connectedCallback() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.#deferredPrompt = e;
      console.log(`'beforeinstallprompt' event was fired.`);
    });

    window.addEventListener('appinstalled', () => {
      this.#deferredPrompt = null;
      console.log('PWA was installed');
    });

    if ('getInstalledRelatedApps' in navigator) {
      this.test();
    } else {
      console.log(`not supported`);
    }
  }

  async test() {
    const relatedApps = await navigator.getInstalledRelatedApps();
    relatedApps.forEach((app) => {
      console.log(app.id, app.platform, app.url);
    });
  }

  get #template() {
    const template = document.createElement('template');
    template.innerHTML = `<button type="button" id="iBtn">インストール</button>`;

    return template.content.cloneNode(true);
  }
}