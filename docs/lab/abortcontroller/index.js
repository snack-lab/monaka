let controller = new AbortController();

const addMessage = (message) => {
  const m = document.getElementById('message');
  const p = document.createElement('p');

  if (typeof message !== 'string') {
    return;
  }

  if ("Download start" === message) {
    m.textContent = "";
  }

  p.innerHTML = message;
  m.appendChild(p);
}

const fetchMovie = async () => {
  const signal = controller.signal;
  const url = new URL(`${location.origin}/monaka/lab/abortcontroller/sample.mp4`);
  const headers = new Headers();
  headers.append('X-Requested-With','XMLHttpRequest');
  const init = {
    headers: headers,
    signal
  };
  const request = new Request(url, init);
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error('Something went wrong on api server!');
  }
  return await response.blob();

}

window.addEventListener('DOMContentLoaded',  () => {
  const abortBtn = document.getElementById('abort');
  abortBtn.addEventListener('click', () => {
    controller.abort();
    addMessage("Download aborted");
  });

  const downloadBtn = document.getElementById('download');
  downloadBtn.addEventListener('click', async () => {
    addMessage("Download start");

    controller = new AbortController();

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(5 * 1000);

    fetchMovie().then(data => {
      console.debug(data);
      addMessage("Download success");
    }).catch(e => {
      addMessage(`Download error: ${e.message}`);
    }).finally(() => {
      controller = null;
    })
  });
});
