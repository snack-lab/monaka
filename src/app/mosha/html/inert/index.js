const dialogBtn = document.querySelector('#dialog-btn');
dialogBtn.onclick = () => {
  const dialog = document.querySelector('#dialog');
  dialog.showModal();
  document.body.inert = true;
  dialog.addEventListener('close', () => {
    document.body.inert = false;
  });
}

const submitBtn = document.querySelector('#submit-btn');
submitBtn.onclick = () => {
  const form = document.querySelector('#form');
  form.inert = true;
  setTimeout(() => {
    form.inert = false;
  }, 2000);
}
