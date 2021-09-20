if (window.Worker) {
  const worker = new Worker(new URL('worker/worker.js', import.meta.url), { type: 'module' });
  worker.postMessage({ message: 'Message posted to worker' });

  worker.addEventListener('message', (event) => {
    if (event.data.message) {
      console.debug('Message received from worker: ', event.data.message);
    }
  });

  worker.addEventListener('error', (error) => {
    console.debug('There is an error with worker!',
     {message: error.message, filename: error.filename, lineno: error.lineno}
    );

    // ワーカーの終了
    // 親workerをterminateすると、子workerも一緒にterminateされる。
    worker.terminate();
  })

  worker.addEventListener('messageerror', (event) => {
    console.debug(event);
  })

} else {
  console.debug(`browser doesn't support web workers.`);
}