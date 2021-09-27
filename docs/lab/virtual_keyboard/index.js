if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true;

  navigator.virtualKeyboard.addEventListener('geometrychanged', (event) => {
    const { x, y, width, height } = event.target;
    console.log('Virtual keyboard geometry changed:', x, y, width, height);
  });
}