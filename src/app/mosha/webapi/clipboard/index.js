document.addEventListener("copy", async (e) => {
  console.debug(e.type);
  // e.preventDefault();
});

document.addEventListener("paste", async e => {
  console.debug(e.type);
  e.preventDefault();
  if (!e.clipboardData.files.length) {
    return;
  }
  const file = e.clipboardData.files[0];
  console.log(await file.text());
});
