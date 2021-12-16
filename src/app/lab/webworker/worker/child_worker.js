const getData = async () => {

  const url = new URL(`${location.origin}/monaka/lab/webworker/worker/sample.json`);

  const header = new Headers([
    ['Content-Type','application/json']
  ]);
  header.append('X-Requested-With','XMLHttpRequest');

  const init = {
    headers: header,
  };

  const request = new Request(url, init);
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error('Something went wrong on api server!');
  }
  return await response.json();
}

self.addEventListener('message', (event) => {
  console.debug('[Child Worker] Message received from parent worker: ', event.data.message);

  getData().then(data => {
    self.postMessage({message: data});
  }).catch(e => {
    self.addEventListener('error' , (error) => {
      throw e;
    },{once : true})
    self.dispatchEvent(new Event('error'));
  })
});

self.addEventListener('messageerror', (event) => {
  console.debug(event);
})