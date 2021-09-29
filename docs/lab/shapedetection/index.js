// https://github.com/WICG/shape-detection-api
// https://wicg.github.io/shape-detection-api

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
    }
  } else {
    alert('Your browser doesn\'t support!');
  }
}

// todo カメラからQRコード取得

detect();

