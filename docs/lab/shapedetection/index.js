const detect = async (image) => {
  const supported = await (
    async () =>
     'BarcodeDetector' in window &&
     ((await BarcodeDetector.getSupportedFormats()).includes('qr_code')) &&
      await new BarcodeDetector().detect(document.createElement('canvas'))
      .then(_ => true)
      .catch(e => e.name === 'NotSupportedError' ? false : true)
    )();

  if (supported) {
    console.debug('QR code scanning is supported.');

    const supportedFormats = await BarcodeDetector.getSupportedFormats();
    console.debug('support formats', supportedFormats);

    const barcodeDetector = new BarcodeDetector({formats: ['qr_code']});
    if (image) {
      try {
        const barcodes = await barcodeDetector.detect(image);

        barcodes.forEach(barcode => console.debug(barcode));
      } catch (e) {
        console.error('Barcode detection failed:', e);
      }
    }
  } else {
    alert('Your browser doesn\'t support!');
  }
}

// todo カメラからQRコード取得

detect();

