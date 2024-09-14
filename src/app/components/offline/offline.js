import sheet from "./offline.css" with { type: "css" };

class OfflineElement extends HTMLElement {
  #root;

  #messages = [
    { level: "alert", text: "ネットワークに接続されていません。電波の良い場所で操作してください。" },
    { level: "warning", text: "ネットワーク速度が低下しています。アプリ動作に時間が掛かる場合がございます。" },
  ];

  #lowEffectiveTypes = ["slow-2g", "2g"];
  #lowDownlink = 1; // Mb/s

  #timeoutID;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
    this.#root.adoptedStyleSheets.push(sheet);
    this.#root.appendChild(this.#template());
  }

  connectedCallback() {
    const currentEffectiveType = navigator.connection.effectiveType;
    const currentDownLink = navigator.connection.downlink;

    this.#changeNetworkInfo(currentEffectiveType, currentDownLink);

    window.onoffline = async () => await this.#checkOffline();
    window.ononline = () => window.clearTimeout(this.#timeoutID);

    navigator.connection.onchange = (event) => {
      const currentEffectiveType = event.target.effectiveType;
      const currentDownLink = event.target.downlink;
      this.#changeNetworkInfo(currentEffectiveType, currentDownLink);
    };
  }

  #open = ({ level, text }) => {
    const o = this.#root.querySelector(".offline");
    o.textContent = text;
    o.classList.add(...["open", level]);
  };

  #close = () => {
    const o = this.#root.querySelector(".offline");
    const levels = this.#messages.map((m) => m.level);
    o.textContent = "";
    o.classList.remove(...["open", ...levels]);
  };

  #changeNetworkInfo = (currentEffectiveType, currentDownLink) => {
    const isLowNetwork = this.#lowEffectiveTypes.includes(currentEffectiveType) || currentDownLink < this.#lowDownlink;
    if (navigator.onLine && isLowNetwork) {
      const warning = this.#messages.find((m) => m.level === "warning");
      this.#open(warning);
    } else {
      this.#close();
    }
  };

  #checkOffline = async () => {
    try {
      const headers = new Headers({
        method: "GET",
        cache: "no-store",
      });
      const url = new URL(`${location.origin}/monaka/`);
      const request = new Request(url, {
        headers: headers,
        mode: "same-origin",
        redirect: "manual",
        signal: AbortSignal.timeout(60000),
      });
      const response = await fetch(request);
      if (!response.ok) throw new Error(response.text);
    } catch (err) {
      const alert = this.#messages.find((m) => m.level === "alert");
      this.#open(alert);

      this.#timeoutID = window.setTimeout(() => {
          location.replace(`${location.origin}/monaka/offline.html`);
      }, 5000);
    }
    this.#timeoutID = window.setTimeout(this.#checkOffline, 5000);
  };

  #template = () => {
    const template = document.createElement("template");
    const html = `<div class="offline"></div>`;
    template.setHTMLUnsafe(html);
    return template.content.cloneNode(true);
  };
}

customElements.define("m-offline", OfflineElement);
