window.addEventListener('error', e => {
  console.debug(e.type, e.message);
});

const observer = new ReportingObserver((reports, observer) => {
  const message = JSON.stringify(reports)
  // navigator.sendBeacon("", message)
  console.debug(message);
});
observer.observe();
