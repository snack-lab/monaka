// file handler
if ("launchQueue" in window) {
  window.launchQueue.setConsumer((launchParams) => {
    if (launchParams.targetURL) {
      const url = new URL(launchParams.targetURL);
      const files = launchParams.files;
      console.debug(url);
      console.debug(files);
    }
  });
}
