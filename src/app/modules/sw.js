import appConfig from "../appConfig.js";

window.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${appConfig.appScope}sw.js`, { type: 'module', scope: `${appConfig.appScope}`})
    .then((registration) => {
      let sw = registration.installing || registration.waiting || registration.active;
      console.debug(`service worker: ${sw.state} `, registration.scope);

      if (sw) {
        // installing, installed, activating, activated, redundant
        sw.addEventListener('statechange', e => {
          console.debug(`service worker change state: ${e.target.state}`);
        });
      }

      registration.addEventListener('updatefound', () => {
        // 新しいサービスワーカーを取得時
        let installWorker = registration.installing;
        console.debug(`新しいservice workerをインストールしています。`, installWorker);
        // インストール中のservice workerの状態変更
        // installWorker.addEventListener('statechange', e =>{});
      });

      // registration.unregister().then((bool) => {
      //   if (bool) {
      //     // trueなら登録解除成功
      //     console.debug("登録を解除しました。");
      //   }
      // });
    }).catch((error) => {
      console.debug(`service worker 登録失敗 `, error);
    });

    // 現在service workerが制御されているかどうか。
    if (navigator.serviceWorker.controller) {
      console.debug(`このページは現在 service worker によって制御されています。`, navigator.serviceWorker.controller)
    }

    // 新しいactiveなワーカーを取得すると発生
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.debug(`このページは今 service worker によって制御されています。`, navigator.serviceWorker.controller);
    })
  } else {
    console.debug(`service workerをサポートしていません。`);
  }
});
