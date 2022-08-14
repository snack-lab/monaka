// if (HTMLScriptElement.supports && HTMLScriptElement.supports('importmap')) {
//   await import("modules.sw.js");
//   await import("modules.navigation.js");
//   await import("modules.env.js");
// } else {
  await import("./modules/sw.js");
  await import("./modules/navigation.js");
  await import("./modules/env.js");
// }

import { requestWakeLock, releaseWakeLock, handleVisibilityChange } from "./modules/wakelock.js";
window.addEventListener("DOMContentLoaded", requestWakeLock);
document.addEventListener('visibilitychange', handleVisibilityChange);


const windowLogEvents = [
  'pageshow',
  'load',
  'beforeunload',
  'unload',
  'pageshide',
  'DOMContentLoaded',
  'error',
];

const documentLogEvents = [
  'readystatechange',
  'offline',
  'online'
];

const eventLogger = event => {
  console.debug(event.type, event);
}

windowLogEvents.forEach(eventName => {
  window.addEventListener(eventName, eventLogger);
})

documentLogEvents.forEach(eventName => {
  document.addEventListener(eventName, eventLogger);
});
