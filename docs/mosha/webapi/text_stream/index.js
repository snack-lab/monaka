const response = await fetch(`${location.origin}/monaka`)
// const stream = response.body.pipeThrough(new TextDecoderStream());
// const reader = stream.getReader();
// reader.read().then(({ done, value }) => {
//   if (done) {
//     console.log("ストリームの読み取りが完了しました");
//   } else {
//     console.log("読み取ったデータ:", value);
//   }
// });

response.body
  .pipeThrough(new TextDecoderStream()) // 受信したデータをテキストに変換
  .pipeThrough(new TextEncoderStream()) // 受信したデータをエンコード(UTF-8でエンコードしたUint8Arrayを生成)
  .pipeTo(
    new WritableStream({
      write(chunk) {
        console.log("受信したデータ:", chunk);
      },
      close() {
        console.log("ストリームの読み取りが完了しました");
      },
    })
  )
