const getPage = async (url, option) => {
  const res = await fetch(url, option);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const title = doc.title;
  const body = doc.body;
  return { title, body };
}

if ("navigation" in window) {
  navigation.addEventListener("navigate", async (e) => {

    if ( e.canTransition === false || e.hashChange === true || e.downloadRequest !== null) {
      return;
    }

    e.transitionWhile(
      (async () => {
        const url = e.destination.url;
        const signal = e.signal;

        signal.addEventListener("abort", () => {
          console.debug("navigation aborted");
          location.reload();
        });

        const cache = "no-cache";
        const { title, body } = await getPage(url, { cache, signal });

        document.title = title;
        document.body = body;
        console.debug("transition end");
      })()
    );
  });

  navigation.addEventListener("navigatesuccess", (e) => {
    console.debug(e.type, e);
  });

  navigation.addEventListener("navigateerror", (e) => {
    console.debug(e.type, e);
  });

  navigation.addEventListener("currententrychange", (e) => {
    console.debug(e.type, e);
  });
}
