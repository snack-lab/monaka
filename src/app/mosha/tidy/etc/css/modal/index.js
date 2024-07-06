const showModalButton = document.querySelector("#show_modal");
const showButton = document.querySelector("#show");
const dialog = document.querySelector("#sample_dialog");
const message = document.querySelector("#sample_dialog #message");

showModalButton.addEventListener('click', () => {
    message.textContent = `show_modal`;
    dialog.showModal();
});

showButton.addEventListener('click', () => {
    message.textContent = `show`;
    dialog.show();
})

const fullscreenButton = document.querySelector("#fullscreen");
const fullscreenMessage = document.querySelector("#fullscreen_message");

fullscreenButton.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) {
        fullscreenMessage.style.display = "block";
        await fullscreenMessage.requestFullscreen();
    } else {
        fullscreenMessage.style.display = "none";
        await document.exitFullscreen();
    }
  } catch (e) {
    console.debug(e);
  }
});

fullscreenMessage.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenMessage.style.display = "none";
    }
});
