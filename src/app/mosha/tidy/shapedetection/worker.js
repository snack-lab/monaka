self.addEventListener('message', async (e) => {
  const qrcodeData = e.data.qrcode;
  const barcodeDetector = new BarcodeDetector({formats: ['qr_code']});
  try {
    const barcodes = await barcodeDetector.detect(qrcodeData);
    // barcodes.forEach(barcode => console.debug(barcode));
    self.postMessage(barcodes);
  } catch (e) {
    console.error('Barcode detection failed:', e);
    self.postMessage(`Detection error: ${e.message}`);
  }
});