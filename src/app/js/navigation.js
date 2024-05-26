if ("navigation" in window) {

  navigation.addEventListener('navigate', async (event) => {
    if (!event.canIntercept || event.hashChange || event.downloadRequest !== null) {
      return;
    }

   const url = new URL(event.destination.url);
   const home = `${location.origin}/monaka`;
   if (url.pathname === `/monaka/index.html` || url.pathname === `/monaka`) {
      await navigation.navigate(`${home}/index.html`).finished
    } else {
      event.intercept({
        async handler() {
          await navigation.navigate(`${home}/404.html`, { history: "replace" }).finished
        }
      });
    }
  });
}
