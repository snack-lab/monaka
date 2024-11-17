import sheet from "./fullscreen.css" with { type: 'css' };

class FullScreenElement extends HTMLElement {
  #root;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.adoptedStyleSheets.push(sheet);
    this.#root.appendChild(this.#template());

    const fullscreenBtn = this.#root.querySelector(".fullscreen");
    fullscreenBtn.onclick = () => this.#fullscreen();

    document.addEventListener('fullscreenchange', this.#log);
    document.addEventListener('fullscreenchange', this.#lock);
    document.addEventListener('fullscreenerror', this.#errorLog);
  }

  #template = () => {
    const template = document.createElement("template");
    const html = `<button type="button" class="fullscreen">Full Screen</button>`;
    template.setHTMLUnsafe(html);
    return template.content.cloneNode(true);
  }

  #fullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        if (document.fullscreenEnabled) {
          const options = {
            avigationUI: "hide",
            // todo
            // screen: ""
          }
          await document.documentElement.requestFullscreen(options);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  #log = () => {
    if (document.fullscreenElement) {
      console.debug(document.fullscreenElement?.nodeName);
    } else {
      console.debug("close full screen");
    }
  }

  #lock = async () => {
    const supportsKeyboardLock = ('keyboard' in navigator) && ('lock' in navigator.keyboard);
    const { state } = await navigator.permissions.query({ name: 'keyboard-lock' });

    if (supportsKeyboardLock && state === 'granted') {
      if (document.fullscreenElement) {
        try {
          await navigator.keyboard.lock(['Escape']);
          console.log('Keyboard locked.');
        } catch (error) {
          console.debug('Keyboard locked error.', error);
        }
        return;
      }
      navigator.keyboard.unlock();
      console.log('Keyboard unlocked.');
    }
  }

  #errorLog = (event) => {
    console.debug(event);
  }
}

customElements.define("m-fullscreen", FullScreenElement);
