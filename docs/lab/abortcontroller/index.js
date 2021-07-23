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

window.addEventListener('DOMContentLoaded',  () => {
  let controller;

  const abortBtn = document.getElementById('abort');
  abortBtn.addEventListener('click', () => {
    controller.abort();
    addMessage("Download aborted");
  });

  const downloadBtn = document.getElementById('download');
  downloadBtn.addEventListener('click', async () => {
    addMessage("Download start");

    controller = new AbortController();
    const signal = controller.signal;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(5 * 1000);

    const url = new URL(`${location.origin}/monaka/lab/abortcontroller/sample.mp4`);
    const headers = new Headers();
    headers.append('X-Requested-With','XMLHttpRequest');
    const init = {
      headers: headers,
      signal
    };
    const request = new Request(url, init);

    await fetch(request).then(data => {
      addMessage("Download success");
    }).catch(e => {
      addMessage(`Download error: ${e.message}`);
    })
  });
});
