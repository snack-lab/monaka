if ("EyeDropper" in window) {
  let abortController = null;
  const selectBtn = document.getElementById("select_btn");
  selectBtn.addEventListener("click", async () => {
    abortController = new AbortController();
    const eyeDropper = new EyeDropper();
    try {
      // const result = await eyeDropper.open({ signal: abortController.signal });
      const result = await eyeDropper.open();
      console.log(result);
    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      abortController.abort();
    }, 1000);
  });
}
