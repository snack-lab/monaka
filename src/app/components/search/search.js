import sheet from "./search.css" with { type: "css" };

class SearchElement extends HTMLElement {
  #root;
  #recognition;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.adoptedStyleSheets.push(sheet);
    this.#root.appendChild(this.#template());

    this.#initSpeech();

    if (this.#recognition) {
      const speechBtn = this.#root.querySelector("button");
      speechBtn.addEventListener('click', this.#speech)
    } else {
      alert("音声入力をサポートしていません。");
    }
  }

  #template = () => {
    const template = document.createElement("template");
    const html = `
      <search>
        <form action="#" method="GET" class="search-form">
          <input type="search" name="q" id="search" placeholder="キーワード検索" inputmode="search" enterkeyhint="search">
          <button type="button" aria-label="音声入力">
        </form>
      </search>
    `;
    template.setHTMLUnsafe(html);
    return template.content.cloneNode(true);
  }

  #initSpeech = () => {
    const SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
    const words = [];

    if (SpeechRecognition) {
      this.#recognition = new SpeechRecognition();
      const SpeechGrammarList = webkitSpeechGrammarList || SpeechGrammarList;
      // if (SpeechGrammarList) {
      //   const speechRecognitionList = new this.#SpeechGrammarList();
      //   const grammar = '#JSGF V1.0; grammar words; public <words> = ' + words.join(' | ') + ' ;'
      //   speechRecognitionList.addFromString(grammar, 1);
      //   this.#recognition.grammars = speechRecognitionList;
      // }
      //this.#recognition.continuous = false;
      this.#recognition.lang = "ja-JP";
      this.#recognition.interimResults = false;
      this.#recognition.maxAlternatives = 1;

      this.#recognition.addEventListener('audiostart', this.#debug);
      this.#recognition.addEventListener('audioend', this.#debug);
      this.#recognition.addEventListener('end', this.#debug);
      this.#recognition.addEventListener('error', (event) => {
        this.#debug(event);
        console.debug(event.error);
        console.debug(event.message);
      });
      this.#recognition.addEventListener('nomatch', this.#debug);
      this.#recognition.addEventListener('result', (event) => {
        const q = this.#root.querySelector("#search");
        q.value = event.results[0][0].transcript;
        this.#debug(event);
      });
      this.#recognition.addEventListener('soundstart', this.#debug);
      this.#recognition.addEventListener('soundend', (event) => {
        // this.#recognition.abort();
        this.#recognition.stop();
        this.#debug(event);
      });
      this.#recognition.addEventListener('speechstart', this.#debug);
      this.#recognition.addEventListener('speechend', this.#debug);
      this.#recognition.addEventListener('start', this.#debug);
    }
  }

  #speech = () => {
    const q = this.#root.querySelector("#search");
    q.value = "";
    this.#recognition.start();
  }

  #debug = (event) => {
    console.debug(event.type, event);
  }
}

customElements.define("m-search", SearchElement);
