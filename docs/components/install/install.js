import sheet from "./install.css" with { type: 'css' };

class InstallElement extends HTMLElement {
  #root;
  #deferredPrompt;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.adoptedStyleSheets.push(sheet);
    this.#root.appendChild(this.#template());

    const insBtn = this.#root.querySelector(".install");
    insBtn.onclick = async () => await this.#installing();
  }

  connectedCallback() {
    if ("onbeforeinstallprompt" in window) {
      window.addEventListener('beforeinstallprompt', this.#before);
    }

    if ("onappinstalled" in window) {
      window.addEventListener('appinstalled', this.#installed);
    }

    if ("getInstalledRelatedApps" in navigator) {
      this.#isInstalledRelatedApps();
    }
  }

  #template = () => {
    const template = document.createElement("template");
    const html = `<button type="button" class="install">install</button>`;
    template.setHTMLUnsafe(html);
    return template.content.cloneNode(true);
  }

  #before = (event) => {
    event.preventDefault();
    this.#deferredPrompt = event;
  }

  #installing = async () => {
    if (this.#deferredPrompt) {
      this.#deferredPrompt.prompt();

      const { outcome } = await this.#deferredPrompt.userChoice;
      if (outcome === "dismissed") {
        this.#deferredPrompt = null;
      }
    }
  };

  #isInstalledRelatedApps = async () => {
    const relatedApps = await navigator.getInstalledRelatedApps();
    if (0 < relatedApps.length) {
      this.remove();
    }
  };

  #installed = () => {
    this.#deferredPrompt = null;
    this.remove();
  };
}

customElements.define("m-install", InstallElement);
