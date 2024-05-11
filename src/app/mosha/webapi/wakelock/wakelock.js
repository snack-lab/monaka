let wakeLock = null;

const isSecure = window.isSecureContext;
const supportWakeLock = "wakeLock" in navigator ? true : false;
const isSupported = supportWakeLock && isSecure ? true : false;

export async function requestWakeLock() {
  if (!isSupported) {
    console.debug('Not Supported');
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request("screen");
    console.debug('Locked');

    wakeLock.onrelease = () => console.debug('Released');
  } catch (error) {
    console.error(`${error.name} ${error.message}`);
  }
}

export function releaseWakeLock() {
  if (wakeLock === null || !isSupported) return;
  wakeLock.release().then(() => (wakeLock = null));
}

export function handleVisibilityChange() {
  if (wakeLock === null || document.visibilityState !== "visible") return;
  requestWakeLock();
}
