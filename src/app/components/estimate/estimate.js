class EstimateElement extends HTMLElement {
  #root;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#estimate().then((e) => this.#root.appendChild(this.#template(e)));
  }

  #estimate = async () => {
    const e = { quota: 0, usage: 0 };

    if (navigator.storage && navigator.storage.estimate) {
      const quota = await navigator.storage.estimate();

      const usageGB = (quota.usage / 1000 ** 3).toFixed(2);
      const quotaGB = (quota.quota / 1000 ** 3).toFixed(0);

      e.quota = quotaGB;
      e.usage = usageGB;
    }
    return e;
  };

  #message = ({ quota, usage }) => `ストレージ使用量: 約${quota}GB/約${usage}GB`;

  update = async () => {
    const e = await this.#estimate();

    const storageEstimate = this.#root.querySelector(".storage-estimate");
    storageEstimate.textContent = this.#message({ quota: e.quota, usage: e.usage });
  };

  #template = (e) => {
    const template = document.createElement("template");
    const html = `<span class="storage-estimate">${this.#message({ quota: e.quota, usage: e.usage })}</span>`;;
    template.setHTMLUnsafe(html);
    return template.content.cloneNode(true);
  };
}

customElements.define("m-estimate", EstimateElement);
