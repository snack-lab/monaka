// https://developer.mozilla.org/ja/docs/Web/API/Screen_Orientation_API

const movie = document.querySelector('.sample_movie');

movie.onloadedmetadata = (event) => {
  console.debug(`movie width: ${event.target.videoWidth }`);
  console.debug(`movie height: ${event.target.videoHeight}`);
}

const orientationChange = document.querySelector('.orientation-change');
const orientationCancel = document.querySelector('.orientation-cancel');

orientationChange.onclick = async () => {
  console.debug(screen.orientation.type)

  if (screen.orientation.type === "landscape-primary" || screen.orientation.type === "landscape-secondary") {
    await document.body.requestFullscreen();
    await screen.orientation.lock('portrait');
  } else if (screen.orientation.type === "portrait-primary" || screen.orientation.type === "portrait-secondary") {
    await document.body.requestFullscreen();
    await screen.orientation.lock('landscape');
  }
}

orientationCancel.onclick = () => {
  screen.orientation.unlock();
  document.exitFullscreen()
}
