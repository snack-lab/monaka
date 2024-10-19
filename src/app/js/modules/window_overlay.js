// window-controls-overlay
if ('windowControlsOverlay' in navigator) {
  if (navigator.windowControlsOverlay.visible) {
    console.debug(navigator.windowControlsOverlay.getTitlebarAreaRect());
  }

  navigator.windowControlsOverlay.addEventListener("geometrychange",(event) => {
    if (event.visible) {
      const rect = event.titlebarAreaRect;
      console.debug(rect);
    }
  });
}
