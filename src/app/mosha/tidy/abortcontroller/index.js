let controller = new AbortController();
let signal = controller.signal;

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
  const url = new URL(`./sample.mp4`, import.meta.url);
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

const sleep = async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(5 * 1000);
}

window.addEventListener('DOMContentLoaded', () => {

  const abortBtn = document.getElementById('abort');
  abortBtn.addEventListener('click', () => {
    controller.abort();

    if (signal.aborted) {
      addMessage("Download aborted");
    }
  });

  const downloadBtn = document.getElementById('download');
  downloadBtn.addEventListener('click', async () => {
    addMessage("Download start");

    controller = new AbortController();
    signal = controller.signal;
    signal.addEventListener('abort', () => {
      console.debug('abort!');
    })

    await sleep();

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


// 複数
{
 const urls = [];
 const controller = new AbortController();
 const fetches = urls.map(async(url) => {
  await fetch(url, {
    signal: controller.signal
  })
 });
 const results = await Promise.all(fetches);
 // controller.abort();
}

// 別々一括
{
  const urls = [];
  const controller = new AbortController();
  const f1 = new Promise((resolve, reject) => {
    controller.signal.addEventListener('abort', reject);
  })
  const f2 = urls.map(async(url) => {
    await fetch(url, {
      signal: controller.signal
    })
   });
   const results = await Promise.all(f2,f1);
   // controller.abort();
}