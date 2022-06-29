let wakeLock = null;
let isSupported = null;

if ("wakeLock" in navigator) {
  isSupported = true;
} else {
  isSupported = false;
}


export const requestWakeLock = async () => {
  if (isSupported) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      console.debug(`Locked`);

      wakeLock.addEventListener("release", () => {
        console.debug("Released");
      });
    } catch (err) {
      console.debug(`${err.name} ${err.message}`);
    }
  }
}

export const releaseWakeLock = () => {
  if (wakeLock !== null && isSupported) {
    wakeLock.release().then(() => {
      wakeLock = null;
    });
  }
}

export const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock();
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange);
document.addEventListener('DOMContentLoaded', requestWakeLock);
