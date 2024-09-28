if ('virtualKeyboard' in navigator) {
  // 仮想キーボードを処理
  navigator.virtualKeyboard.overlaysContent = true;

  const vEdit = document.getElementById('v-edit');
  vEdit.addEventListener('dblclick', (e) => {
    console.log("virtual keyboard show");
    // 仮想キーボード表示
    navigator.virtualKeyboard.show();

    // 仮想キーボードの現在のジオメトリを取得
    const { x, y, width, height } = navigator.virtualKeyboard.boundingRect;
    console.log('Virtual keyboard geometry:', x, y, width, height);
  });

  vEdit.addEventListener('focusout', (e) => {
    console.log("virtual keyboard hide");
    // 仮想キーボード非表示
    navigator.virtualKeyboard.hide();

    // 仮想キーボードの現在のジオメトリを取得
    const { x, y, width, height } = navigator.virtualKeyboard.boundingRect;
    console.log('Virtual keyboard geometry:', x, y, width, height);
  });

  navigator.virtualKeyboard.addEventListener('geometrychange', (event) => {
    // 仮想キーボード表示/非表示時のイベント
    const { x, y, width, height } = event.target;
    console.log('Virtual keyboard geometry changed:', x, y, width, height);
  });

  // 仮想キーボードの現在のジオメトリを取得
  const { x, y, width, height } = navigator.virtualKeyboard.boundingRect;
  console.log('Virtual keyboard geometry:', x, y, width, height);
}
