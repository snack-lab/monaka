import {
  requestWakeLock,
  releaseWakeLock,
  handleVisibilityChange,
} from "./wakelock.js";

await requestWakeLock();
document.addEventListener("visibilitychange", handleVisibilityChange);

const releaseBtn = document.getElementById("release");
releaseBtn.onclick = () => {
  releaseWakeLock();

  const message = document.getElementById("message");
  message.textContent = `Wake Lock has been released`;
};
