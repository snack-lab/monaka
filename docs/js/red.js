if ('wakeLock' in navigator) {
  const releaseBtn = document.getElementById('release');
  const message = document.getElementById('message');
  let wakeLock = null;

  try {
    wakeLock = await navigator.wakeLock.request('screen');

    wakeLock.addEventListener('release', () => {
      message.textContent = 'Wake Lock has been released';
    });

    message.textContent = `Wake Lock is active!`;
  } catch (err) {
    message.textContent = `${err.name}, ${err.message}`;
  }

  releaseBtn.addEventListener('click', (e) => {
    if (wakeLock !== null) {
      wakeLock.release()
      .then(() => {
        wakeLock = null;
      });
    }
  });
}