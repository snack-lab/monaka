const p = new URLPattern({
  pathname: '/monaka/:page.html',
  baseURL: location.origin,
});

const result = p.exec(`${location.origin}/monaka/about.html`);

console.log(result);

const noMatchResult = p.exec(`${location.origin}/monaka/help.html`);

console.log(noMatchResult);
