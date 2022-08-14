import { requestWakeLock, releaseWakeLock, handleVisibilityChange } from "../modules/wakelock.js";

import styles from "../css/red.css" assert { type: "css" };
document.adoptedStyleSheets.push(styles);

requestWakeLock();
document.addEventListener('visibilitychange', handleVisibilityChange);

const releaseBtn = document.getElementById('release');
releaseBtn.onclick = () => {
  releaseWakeLock();

  const message = document.getElementById("message");
  message.textContent = `Wake Lock has been released`;
}
