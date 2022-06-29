export default class EstimateElement extends HTMLElement {
  #root;
  #usage = 0;
  #quota = 0;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
  }

  connectedCallback() {
    this.estimate();
  }

  async estimate() {
    if (navigator.storage && navigator.storage.estimate) {
      const quota = await navigator.storage.estimate();

      console.log(quota);

      // quota.usage -> Number of bytes used.
      // quota.quota -> Maximum number of bytes available.
      this.#usage = (quota.usage / 1024 ** 2).toFixed(2);
      this.#quota = (quota.quota / 1024 ** 2).toFixed(2);

      const percentageUsed = (quota.usage / quota.quota) * 100;
      const remaining = quota.quota - quota.usage;
      // console.log(`You've used ${percentageUsed}% of the available storage.`);
      // console.log(`You can write up to ${remaining} more bytes.`);

      this.#root.appendChild(this.#template);
    }
  }

  get #template() {
    const template = document.createElement("template");
    template.innerHTML = `<div>ストレージ使用量:&nbsp;${this.#usage}MB</div>`;
    return template.content.cloneNode(true);
  }
}
