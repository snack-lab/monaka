if ('CompressionStream' in window) {
  const button = document.querySelector("button");

  button.addEventListener('click', async () => {
    const readableStream = await fetch('sample.txt').then(
      (response) => response.body
    );
    // 圧縮
    const compressedReadableStream = readableStream.pipeThrough(
      new CompressionStream('gzip')
    );
    // 展開
    const decompressedReadableStream = compressedReadableStream.pipeThrough(
      new DecompressionStream('gzip')
    );

    // 展開2
    async function DecompressBlob(blob) {
      const ds = new DecompressionStream("gzip");
      const decompressedStream = blob.stream().pipeThrough(ds);
      return await new Response(decompressedStream).blob();
    }

    const response = await new Response(decompressedReadableStream);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = "sample.txt";
    a.href = objectURL;
    a.click();

    URL.revokeObjectURL(objectURL);
    a.remove();
  });
} else {
  console.log(`your browser doesn't support the CompressionStream API.`);
}
