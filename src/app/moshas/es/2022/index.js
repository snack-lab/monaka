{
  // array, string, typedarray .at
  const array = ["あ","い","う","え","お"];
  console.debug(array.at(2));
  console.debug(array.at(-3));

  const str = "sample";
  console.debug(str.at(4));
  console.debug(str.at(-4));
}

{
  // Top-Level Await
  const sampleData = await fetch("./sample.json");
  console.debug(await sampleData.json());
}

{
  // Object.hasOwn
  const sample = {
    id: 1,
    name: "taro",
    message: "こんにちは"
  }
  console.debug("hasOwn", Object.hasOwn(sample, "id"));
}

{
  // Error.cause
  async function test() {
    try {
      await test2();
    } catch(error) {
      console.debug("Error Test", error);
    }
  }

  async function test2() {
    try {
      const res = await fetch("./sample2.json");
      if (res.status === 404) {
        throw new Error("404", {cause: error});
      }
    } catch(error) {
      throw new Error("404", {cause: error});
    }
  }

  test();
}

{
  // regExp-matchi-ndices (/dフラグ)
  // マッチした文字列の先頭と末尾のインデックス情報取得
  const re1 = /a+(?<Z>z)?/d;
  const s1 = "xaaaz";
  const m1 = re1.exec(s1);
  m1.indices[0][0] === 1;
  m1.indices[0][1] === 5;
  s1.slice(...m1.indices[0]) === "aaaz";
  console.debug(m1);
}
