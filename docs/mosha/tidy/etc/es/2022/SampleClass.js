export default class SampleClass {
  // private
  #text;
  // static filed
  static #cnt = 1;

  #n = 0;

  static #msg = "";

  // static initializer
  static {
    console.debug("initialize...");
    this.#msg = "initialize";
  }

  constructor(text) {
    this.#text = text;
    this.#n = SampleClass.#next();
    console.debug(SampleClass.#msg);
  }

  // private
  #log() {
    console.log("Log....", this.#text);
  }

  static #next() {
    return SampleClass.#cnt++;
  }

  display() {
    this.#log();
    return this.#text;
  }

  get num() {
    return this.#n;
  }
}
