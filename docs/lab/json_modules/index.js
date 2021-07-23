import config from './config.json' assert {type: 'json'};

window.addEventListener('DOMContentLoaded', () => {
  const title = config.appTtile;
  const h =document.getElementById('h');
  h.innerHTML = title;
});