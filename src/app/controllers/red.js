import { requestWakeLock, releaseWakeLock, handleVisibilityChange } from "../modules/wakelock.js";

import styles from "../css/red.css" assert { type: "css" };
document.adoptedStyleSheets.push(styles);

window.addEventListener("DOMContentLoaded", requestWakeLock);
document.addEventListener('visibilitychange', handleVisibilityChange);

const message = document.getElementById("message");
const releaseBtn = document.getElementById('release');
releaseBtn.onclick = () => {
  releaseWakeLock();
  message.textContent = `Wake Lock has been released`;
}
