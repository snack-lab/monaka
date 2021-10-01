// https://github.com/WICG/shape-detection-api
// https://wicg.github.io/shape-detection-api
// https://web.dev/shape-detection/

const detect = async (image) => {
  const supported = await (
    async () =>
     'Worker' in window &&
     'BarcodeDetector' in window &&
     ((await BarcodeDetector.getSupportedFormats()).includes('qr_code')) &&
      await new BarcodeDetector().detect(document.createElement('canvas'))
      .then(_ => true)
      .catch(e => e.name === 'NotSupportedError' ? false : true)
    )();

  if (supported) {
    const supportedFormats = await BarcodeDetector.getSupportedFormats();
    console.debug('QR code scanning is supported.');
    console.debug('support formats', supportedFormats);

    if (image) {
      const worker = new Worker(new URL('worker.js', import.meta.url), { type: 'module' });
      worker.postMessage({ qrcode: image });

      worker.addEventListener('message', (event) => {
        if (event.data) {
          console.debug('Message received from worker: ', event.data);
        }
      });
    }
  } else {
    alert('Your browser doesn\'t support!');
  }
}

const cameraLaunch = document.getElementById('launch');
cameraLaunch.addEventListener('click', async (e) =>{
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      // facingMode: { exact: "environment" },
      facingMode: "user",
      width: 300,
      height: 300
    }
  });

  const video = document.createElement('video');
  video.srcObject = stream;

  document.body.appendChild(video);
  video.play();

  setTimeout( async () => {
    // ビデオ停止
    video.pause();
    // 画像生成
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = video.offsetWidth;
    const h = video.offsetHeight;
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    ctx.drawImage(video, 0, 0, w, h);
    stream.getTracks()[0].stop();
    // QR読み込み
    detect(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }, 3000);
});