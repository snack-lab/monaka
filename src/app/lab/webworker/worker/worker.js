// Dedicated workerからDedicated Workerを作ることはできる。
// 現在はShared Worker,Service WorkerからDedicated Worker作ったり、また逆も作ることはできない。
const child_worker = new Worker('child_worker.js');

self.addEventListener('message', (event) => {
  console.debug('[Worker] Message received from main script: ', event.data.message);

  // self.postMessage({ message: 'Posting message back to main script'});
  if (event.data.message) {
    child_worker.postMessage({ message: event.data.message});
  }
})

self.addEventListener('messageerror', (event) => {
  console.log(event);
})

child_worker.addEventListener('message', (event) => {
  if (event.data.message) {
    const childMessage = event.data;
    self.postMessage(childMessage);
  }
})

child_worker.addEventListener('error', (error) => {
  console.debug('There is an error with child worker!',
   {message: error.message, filename: error.filename, lineno: error.lineno}
  );
})

child_worker.addEventListener('messageerror', (event) => {
  console.debug(event);
})

