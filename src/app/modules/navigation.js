if ('navigation' in window) {
  const getPage = async (url, init) => {
    const response = await fetch(url, init);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const title = doc.title;
    const body = doc.body;
    return { title, body }
  }

  const transition = async (event) => {
    const url = new URL(event.destination.url);
    const signal = event.signal;

    signal.addEventListener('abort', (event) => {
      console.debug(event.type, event);
      location.reload();
    });

    const headers = { cache: "no-store" };
    const { title, body } = await getPage(url.pathname, { headers, signal });
    document.title = title;
    document.body = body;
  }

  navigation.addEventListener('navigate', async (event) => {
    console.debug(event.type, event);

    if (event.canTransition === false || event.hashChange === true || event.downloadRequest !== null) {
      return;
    }

    const url = new URL(event.destination.url);
    if (url.pathname === "/monaka/index.html" || url.pathname === "/monaka/") {
      return;
    } else {
      event.transitionWhile(transition(event));
    }
  });

  navigation.addEventListener("navigatesuccess", (event) => {
    console.debug(event.type, event);
  });

  navigation.addEventListener("navigateerror", (event) => {
    console.debug(event.type, event);
  });

  navigation.addEventListener("currententrychange", (event) => {
    console.debug(event.type, event);
  });
}
