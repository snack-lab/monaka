import appConfig from "../../appConfig.json" with { type: "json" };

const swScope = appConfig.scope;
const swURL = new URL(`${location.origin}${swScope}sw.js`);
const updatedMessage = appConfig.messages.sw.update;

const registration = await navigator.serviceWorker.register(swURL.href, { type: "module", scope: swScope });
const sw = registration.installing || registration.waiting || registration.active;

if (sw) {
  if (sw.state === "activated") {
    if ("periodicSync" in registration) {
      const status = await navigator.permissions.query({ name: "periodic-background-sync" });
      if (status.state === "granted") {
        const tags = await registration.periodicSync.getTags();
        const targetName = appConfig.periodicSync.tags.resources.name;
        const interval = parseInt(appConfig.periodicSync.tags.resources.minInterval, 10);
        if (!tags.includes(`${targetName}`)) {
          try {
            await registration.periodicSync.register(`${targetName}`, {
              minInterval: interval,
            });
          } catch (error) {}
        }
      }
    }

    registration.addEventListener("updatefound", () => {
      const installWorker = registration.installing;
      installWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "installed") {
          alert(updatedMessage);
          location.replace(`${location.origin}${swScope}/index.html`);
        }
      });
    });
  }

  if ("PushManager" in window && "Notification" in window) {
    const notificationsStatus = await navigator.permissions.query({ name: "notifications" });
    // const pushStatus = await navigator.permissions.query({ name: "push", userVisibleOnly: true });
    if (notificationsStatus.state === "prompt") {
      const permission = await Notification.requestPermission();
      // const subscribeOptions = {
      //   userVisibleOnly: true,
      //   applicationServerKey: "",
      // };
      // const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
      // const subscriptionObject = {
      //   endpoint: pushSubscription.endpoint,
      //   keys: {
      //     p256dh: pushSubscription.getKey("p256dh"),
      //     auth: pushSubscription.getKey("auth"),
      //   },
      // };
      // const subscriptionObjectToo = JSON.stringify(subscriptionObject);

      if (permission === "granted") {
        const title = "monaka";
        const options = {
          body: "Welcome to Monaka!",
          data: {
            link: new URL(`${location.origin}${swScope}`).href
          }
        };
        const dummyNotification = new Notification(title, options);
        dummyNotification.onclick = (event) => event.target.close();
      }
    } else if (notificationsStatus.state === "granted") {
    }
  }

}
