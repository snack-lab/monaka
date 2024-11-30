import { asyncFilter } from "./utilities.js";

const chrome = `Google Chrome`;
const edge = `Microsoft Edge`;
const version = 129;

const isRecommend = async () => {
  if (!navigator.userAgentData) {
    return false;
  }

  const uaData = navigator.userAgentData;
  const highEntropyValues = await uaData.getHighEntropyValues(["brands", "platform", "mobile"]);

  const availableTest = [
    { name: "secureContext", test: window.isSecureContext },
    { name: "cookie", test: navigator.cookieEnabled },
    { name: "cache", test: "caches" in self },
    { name: "serviceWorker", test: "serviceWorker" in navigator },
    { name: "BackgroundFetchManager", test: "BackgroundFetchManager" in self },
    { name: "indexedDB", test: "indexedDB" in window },
    { name: "notification", test: "Notification" in window },
    { name: "pushManager", test: "PushManager" in window },
    { name: "navigation", test: "navigation" in window }
  ];

  const permissionTest = [
    { name: "backgroundFetch", query: "background-fetch" },
    { name: "periodicBackgroundSync", query:  "periodic-background-sync" },
    // { name: "screenWakeLock", query:  "screen-wake-lock" },
    // { name: "notifications", query:  "notifications" },
    // { name: "clipboardRead", query:  "clipboard-read" },
    // { name: "clipboardWrite", query:  "clipboard-write" },
    // { name: "windowManagement", query:  "window-management" },
    // { name: "fullscreen", query:  "fullscreen" },
    // { name: "webAppInstallation", query:  "web-app-installation" }
  ];

  const brand = highEntropyValues.brands.find((b) => {
    console.debug(b.brand, b.version);
    return (b.brand === chrome || b.brand === edge) && b.version >= version
  });

  const isAvailable = availableTest.filter(a => {
    console.debug(a.name, a.test);
    return a.test;
  });

  const hasPermission = await asyncFilter(permissionTest, async p => {
    let h = false;
    try {
      const result = await navigator.permissions.query({ name: p.query });
      console.debug(p.name, result);
      h = result.state === "granted" || result.state === "prompt";
    } catch (err) {
      console.error(err);
    }
    return h;
  });

  const isBrowserRecommend = brand ? true : false;
  const isApiSupported = isAvailable.length === availableTest.length;
  const isPermission = hasPermission.length === permissionTest.length;
  const isImportMap = HTMLScriptElement.supports('importmap') ? true : false;
  const isRecommend = isBrowserRecommend && isPermission && isApiSupported && isImportMap ? true : false;

  console.debug("isRecommend", isRecommend);

  return isRecommend;
};

export { isRecommend };
