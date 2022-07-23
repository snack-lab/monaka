
import styles from "./install.css" assert { type: "css"};

export default class InstallButtonElement extends HTMLElement {
  #root;
  #deferredPrompt;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.adoptedStyleSheets.push(styles);
    this.#root.appendChild(this.#template());

    const btn = this.#root.getElementById("iBtn");
    btn.onclick = async (event) => {
      await this.#installing(event);
    }
  }

  connectedCallback() {
    window.onbeforeinstallprompt = this.#beforeInstall;
    window.onappinstalled = this.#installed;

    if ('getInstalledRelatedApps' in navigator) {
      this.#isInstalledRelatedApps().then(isInstalledRelatedApps => {
        if (0 < isInstalledRelatedApps.length) {
          this.remove();
        }
      });
    }
  }

  #template = () => {
    const template = document.createElement('template');
    template.innerHTML = `<button type="button" id="iBtn">App Install</button>`;

    return template.content.cloneNode(true);
  }

  #beforeInstall = (event) => {
    console.debug(event.type, event);
    event.preventDefault();
    this.#deferredPrompt = event;
    // console.log(`'beforeinstallprompt' event was fired.`);
  }

  #installing = async (event) => {
    console.debug(event.type, event);

    this.#deferredPrompt.prompt();

    const { outcome } = await this.#deferredPrompt.userChoice;

    // console.log(`User response to the install prompt: ${outcome}`);

    if (outcome === "dismissed") {
      this.#deferredPrompt = null;
    }
  }

  #installed = (event) => {
    console.debug(event.type, event);
    this.#deferredPrompt = null;
    // console.log('PWA was installed');
  }

  #isInstalledRelatedApps = async () => {
    const relatedApps = await navigator.getInstalledRelatedApps();
    return relatedApps;
  }
}
