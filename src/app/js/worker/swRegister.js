import appConfig from "../../appConfig.json" with { type: "json" };
import { sendSubscription, clearBadge, clearNotifications } from "./sw.mjs";

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

  if ("Notification" in window) {
    await clearBadge();
    await clearNotifications();

    const notificationsStatus = await navigator.permissions.query({ name: "notifications" });
    if (notificationsStatus.state === "prompt") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          // await sendSubscription();

          const title = "monaka";
          const options = {
            body: "Welcome to Monaka!",
              data: {
                link: new URL(`${location.origin}${swScope}`).href
              }
            };
            new Notification(title, options);
        } catch (err) {
          alert(`${appConfig.messages.sw.failedInitPush}`);
          console.debug("An error occurred while retrieving token.", err);
        } finally {
        }
      }
    }
  }
}
