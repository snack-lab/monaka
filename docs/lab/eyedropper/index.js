if ("EyeDropper" in window) {
  let abortControler = null;
  const selectBtn = document.getElementById("select_btn");
  selectBtn.addEventListener("click", async () => {
    abortControler = new AbortController();
    const eyeDropper = new EyeDropper();
    try {
      // const result = await eyeDropper.open({ signal: abortControler.signal });
      const result = await eyeDropper.open();
      console.log(result);
    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      abortControler.abort();
    }, 1000);
  });
}
