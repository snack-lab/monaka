if ("getScreenDetails" in window) {
  let granted = false;

  try {
    // 権限確認
    const { state } = await navigator.permissions.query({ name: "window-placement" });
    granted = state === "granted";
  } catch {}

  if (granted) {
    if (window.screen.isExtended) {
      // 複数の画面がある場合

      // 画面詳細取得
      const screenDetails = await window.getScreenDetails();

      // 画面数changeイベント
      let cachedScreensLength = screenDetails.screens.length;
      screenDetails.addEventListener("screenchange", (event) => {
        if (screenDetails.screens.length !== cachedScreensLength) {
          console.log(`The screen count changed from ${cachedScreensLength} to ${screenDetails.screens.length}`);
          cachedScreensLength = screenDetails.screens.length;
        }
      });

      // 現在の画面changeイベント
      screenDetails.addEventListener("currentscreenchange", async (event) => {
        const details = screenDetails.currentScreen;
        console.log("The current screen has changed.", event, details);
      });

      // 画面詳細changeイベント
      const firstScreen = (await window.getScreenDetails())[0];
      firstScreen.addEventListener("change", async (event) => {
        console.log("The first screen has changed.", event, firstScreen);
      });

      // 主要画面をフルスクリーンにする
      // try {
      //   const primaryScreen = (await getScreenDetails()).screens.filter((screen) => screen.isPrimary)[0];
      //   await document.body.requestFullscreen({ screen: primaryScreen });
      // } catch (err) {
      //   console.error(err.name, err.message);
      // }
    }
  }
}
