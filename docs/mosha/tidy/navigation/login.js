const getPage = async (url, option) => {
  const res = await fetch(url, option);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const title = doc.title;
  const body = doc.body;
  return { title, body };
}

const transition = async (e) => {
  const url = e.destination.url;
  const signal = e.signal;

  signal.addEventListener("abort", () => {
    console.log("navigation aborted");
    location.reload();
  });

  const headers = { "Cache-Control": "no-cache" };
  const { title, body } = await getPage(url, { headers, signal });

  document.title = title;
  document.body = body;
  console.log("transition end");
}

if ("navigation" in window) {
  navigation.addEventListener("navigate", async (e) => {
    if (e.canTransition === false || e.hashChange === true || e.downloadRequest !== null) {
      return;
    }

    if (e.destination.url === `${location.origin}/monaka/lab/navigation/login` ) {
      if (e.formData) {
        const submit = async () => {
          // const response = await fetch(e.destination.url, {
          //   method: "POST",
          //   body: e.formData
          // })
          const response = await fetch(`${location.origin}/monaka/lab/navigation/main.html`, {
            method: "GET",
          })
          const html  = await response.text()
          const url   = new URL(response.url)
          const state = { html }
          await navigation.navigate(url.pathname, { history: "replace", state }).finished
        }
        e.transitionWhile(submit())
      }
    } else if (e.destination.url === `${location.origin}/monaka/lab/navigation/main.html`) {
        e.transitionWhile((async () => {
          const { html }      = e.destination.getState()
          const parser        = new DOMParser()
          const {title, body} = parser.parseFromString(html, "text/html")
          document.title      = title
          document.body       = body
        })())
    } else {
      e.transitionWhile(transition(e));
    }
  });
}
