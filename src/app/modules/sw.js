import appConfig from "../appConfig.js";

if ("serviceWorker" in navigator && self.isSecureContext) {
  window.addEventListener("DOMContentLoaded", async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${appConfig.appScope}sw.js`, { type: 'module', scope: `${appConfig.appScope}` });
      const sw = registration.installing || registration.waiting || registration.active;
      console.debug(`service worker: ${sw.state}`, registration.scope);

      if (sw) {
        sw.addEventListener('statechange', event => {
          console.debug(`service worker change state: ${event.target.state}`);
        });

        if (sw.state === "activated") {
          if ('periodicSync' in registration) {
            const status = await navigator.permissions.query({name:'periodic-background-sync'});
            if (status.state === 'granted') {
              const tags = await registration.periodicSync.getTags();
              if (!tags.includes(`${appConfig.periodicSync.tags.resources.name}`)) {
                try {
                  await registration.periodicSync.register(`${appConfig.periodicSync.tags.resources.name}`, {
                    minInterval: appConfig.periodicSync.tags.resources.minInterval
                  });
                } catch (error) {
                  console.debug(error);
                }
              }
              // console.log('remove periodicSync tags', tags);
              // await Promise.all(tags.map((tag) => registration.periodicSync.unregister(tag)))
            }
          }
        }
      }

      registration.addEventListener('updatefound', () => {
        const installWorker = registration.installing;
        console.debug(`new service worker installing...`, installWorker);

        installWorker.addEventListener('statechange', event => {
          if (event.target.state === "installed") {
            alert("アップデート通知:新しいバージョンがリリスされました。アップデートを実施します。");
            location. href = `${location.origin}/monaka/index.html`
          }
        })
      })

      // registration.unregister().then((bool) => {
      //   if (bool) {
             // trueなら登録解除成功
      //     console.debug("登録を解除しました。");
      //   }
      // });
    } catch (error) {
      console.error(error);
    }

    // 現在service workerが制御されているかどうか。
    if (navigator.serviceWorker.controller) {
      console.debug(`このページは現在 service worker によって制御されています。`, navigator.serviceWorker.controller)
    }

    // 新しいactiveなワーカーを取得すると発生
    navigator.serviceWorker.addEventListener('controllerchange', (event) => {
      console.debug(event.type, event);
    })

  });
} else {
  console.debug(`service workerをサポートしていません。`);
}
