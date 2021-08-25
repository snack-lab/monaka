import { APP_HOME } from '../../../config.js';

import styles from './nav.css' assert { type: 'css' };

export default class NavElement extends HTMLElement {

  #root;
  #navilist = [
    {text: 'Home', href: `${APP_HOME}`},
    {text: 'About', href: 'about.html'}
  ];

  constructor() {
    super();
    this.#root = this.attachShadow({mode: 'open'});
    this.#root.adoptedStyleSheets = [...this.#root.adoptedStyleSheets, styles];
    this.#root.appendChild(this.#template());
  }

  connectedCallback() {
  }

  #template() {
    const template = document.createElement('template');
    template.innerHTML = `
    <div class="header_nav">
    <nav>
      <ul>
      ${this.#navilist.map(nav => `
        <li><a href="${nav.href}">${nav.text}</a></li>
      `).join('')}
      </ul>
    </nav>
    </div>
    `;
    return template.content.cloneNode(true);
  }
}