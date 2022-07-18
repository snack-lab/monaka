// navigation
if ("navigation" in window) {

  const getPage = async (url, init) => {
    const response = await fetch(url, init);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const title = doc.title;
    const body = doc.body;
    return { title, body };
  }

  const transition = async (event) => {
    const url = new URL(event.destination.url);
    const signal = event.signal;

    signal.addEventListener('abort', () => {
      console.debug('navigation aborted');
      location.reload();
    });

    const headers = new Headers();
    headers.append("cache", "no-store");
    const { title, body } = await getPage(url.pathname, {headers: headers, signal: signal});
    document.title = title;
    document.body = body;

    console.debug("transition end");
  }

  navigation.addEventListener('navigate', async (event) => {
    if (event.canTransition === false || event.hashChange === true || event.downloadRequest !== null) {
      return;
    }

    const requestURL = new URL(event.destination.url);
    if (requestURL.pathname === `/` || requestURL.pathname === `/index.html`) {
      return;
    } else {
      event.transitionWhile(transition(event));
    }
  })

  navigation.addEventListener("navigatesuccess", (event) => {
    console.debug(event.type, event);
  })

  navigation.addEventListener("navigateerror", (event) => {
    console.debug(event.type, event);
  })
}
