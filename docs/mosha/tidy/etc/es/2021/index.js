// 数値区切り
{
  const one_hundred_million = 100_000_000;
  console.log(`${one_hundred_million}億`);
}

{
 // マッチしたすべての文字列を置換
 const color =  "赤青黄赤青黄赤青黄赤青黄";
 console.log("before", color);
 console.log("after", color.replaceAll('青', '緑'));
}

{
 // 正規表現の場合、グローバルフラグ必要
 const color2 = "red_blue_yellow_red_blue_yellow_red_blue_yellow_red_blue_yellow";
 const regex = /yellow/ig;
 console.log("before", color2);
 console.log("after", color2.replaceAll(regex, "orange"));
}

{
 // Promise any
 // 渡されたプロミスのうちのいずれかが満足した場合、返却されるプロミスは他のプロミスが満足または拒否されているかどうかにかかわらず、満足したプロミスの値で非同期に満足します。
 // 渡されたすべてのプロミスが拒否された場合、 Promise.any は AggregateError オブジェクトで非同期に拒否され、これはError を継承しており、拒否された値の配列を持つ errors プロパティを含みます。
 const fetchAndDecode = async (url) => {
  return await fetch(url).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error status: ${res.status}`);
    } else {
      return res.blob();
    }
  })
 }

 const sample1 = fetchAndDecode('sample1.jpg');
 const sample2 = fetchAndDecode('sample2.jpg');

 Promise.any([sample1, sample2])
 .then(data => {
  const objectURL = URL.createObjectURL(data);
  const image = document.createElement('img');
  image.src = objectURL;
  document.body.appendChild(image);
 })
 .catch(e => {
  console.log(e.message);
 });
}

{
 // Null 合体代入
 // x が nullish (null または undefined) である場合にのみ代入
 let x = null;
 x ??= "test";
 console.log(x);
}

{
  // 論理和代入 (||=)
  // x が falsy である場合にのみ代入します。
  const test = { x: 50, y: '' };

  test.x ||= 10;
  console.log(test.x);

  test.y ||= 'title is empty.';
  console.log(test.y);
}

{
  // 論理積代入 (&&=)
  // x が truthy である場合にのみ代入します。
  let a = 1;
  let b = 0;

  a &&= 2;
  console.log(a);

  b &&= 2;
  console.log(b);
}

{
  // 弱参照 WeakRef
  let obj = {test: "Test"};
  let ref = new WeakRef(obj);
  console.log(ref.deref());
  obj = null;

  // ガベージコレクションの対象となると、undefinedになる
  console.log(ref.deref());
}