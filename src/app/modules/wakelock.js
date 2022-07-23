let wakeLock = null;
let isSupported = null;

if ("wakeLock" in navigator && self.isSecureContext) {
  isSupported = true;
} else {
  isSupported = false;
}

/**
 * 起動ロック
 */
export async function requestWakeLock() {
  if (isSupported) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      console.debug(`Locked`);

      wakeLock.onrelease = () => {
        console.debug("Released");
      }
    } catch (err) {
      console.error(`${err.name} ${err.message}`);
    }
  }
}

/**
 * 起動ロック開放
 */
export function releaseWakeLock() {
  console.debug("wakeLock", wakeLock);
  console.debug("isSupported", isSupported);

  if (wakeLock !== null && isSupported) {
    wakeLock.release().then(() => {
      wakeLock = null;
    });
  }
}

/**
 * 起動ロック再取得
 */
export function handleVisibilityChange() {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock();
  }
}
