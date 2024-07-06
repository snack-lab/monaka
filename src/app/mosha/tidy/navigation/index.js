const getPage = async (url, option) => {
  const res = await fetch(url, option);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const title = doc.title;
  const body = doc.body;
  return { title, body };
}

const transition = async (e) => {
    const url = e.destination.url;
    const signal = e.signal;

    signal.addEventListener("abort", () => {
      console.log("navigation aborted");
      location.reload();
    });

    const headers = { "Cache-Control": "no-cache" };
    const { title, body } = await getPage(url, { headers, signal });

    document.title = title;
    document.body = body;
    console.log("transition end");
}

const naviBack = async () => {
  if (navigation.canGoBack) {
    await navigation.back({info: "back"}).finished
  }
}

const naviForward = async () => {
  if (navigation.canGoForward) {
    await navigation.forward({info: "forward"}).finished
  }
}

const naviReload = async () => {
  await navigation.reload({ state: { ...navigation.currentEntry.getState() } }).finished
}

// await navigation.navigate(url, state).finished
// await navigation.traverseTo(key).finished;
// focus
// scroll

if ("navigation" in window) {
  console.log(navigation.currentEntry);
  console.log(navigation.entries());

  navigation.addEventListener("navigate", async (e) => {
    console.log(e.type, e);
    console.log("navigationType ", e.navigationType);  // "reload", "push", "replace", or "traverse"
    console.log("destination    ", e.destination);     // ナビゲーションの宛先に関する情報
    console.log("canTransition  ", e.canTransition);   //
    console.log("userInitiated  ", e.userInitiated);   // ユーザによって開始されたかどうか boolean (button.onclick = () => navigation.navigate(...)のようなものは対象外。実際のリンクまたはフォームを使用する必要がある )
    console.log("hashChange     ", e.hashChange);      // 同じドキュメントフラグメントナビゲーションであるかどうか boolean
    console.log("signal         ", e.signal);          // AbortSignal
    console.log("formData       ", e.formData);        // formData or null
    console.log("downloadRequest", e.downloadRequest); // <a href="..." download></a> で開始されたかどうか string(空の場合有) or null
    console.log("info           ", e.info);            // navigation.navigate(url, { state, info }), navigation.back({ info }) などでinfoオプションが指定されている場合
    console.log("cancelable     ", e.cancelable);      // PreventDefault（）がこのナビゲーションをキャンセルできるかどうか
    console.log("canIntercept   ", e.canIntercept);    // intercept（）がこのナビゲーションで許可されているかどうか

    if (e.canTransition === false || e.hashChange === true || e.downloadRequest !== null) {
      return;
    }

    e.transitionWhile(transition(e));
  });

  navigation.addEventListener("currententrychange", (e) => {
    console.log(e.type, e);
    console.log("from", e.from);
  });

  navigation.addEventListener("navigatesuccess", (e) => {
    console.log(e.type, e);

    const b = document.querySelector("#back");
    const f = document.querySelector("#forward");
    const r = document.querySelector("#reload");

    b.addEventListener("click", naviBack);
    f.addEventListener("click", naviForward);
    r.addEventListener("click", naviReload);
  });

  navigation.addEventListener("navigateerror", (e) => {
    console.log(e.type, e);
  });
}
