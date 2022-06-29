import "../modules/app.js";

import HeaderElement from '../components/header/header.js';
customElements.define('m-header', HeaderElement);

document.addEventListener('readystatechange', (event) => {
  console.debug(document.readyState);
});

// service worker
window.addEventListener("beforeinstallprompt", async (e) => {
  console.debug(e.platforms);
});


