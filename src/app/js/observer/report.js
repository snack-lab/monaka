const types = {
  deprecation: "deprecation",
  intervention: "intervention",
  cspViolation: "csp-violation"
}

const options = {
  types: [types.deprecation, types.intervention, types.cspViolation],
  buffered: true
}

const observer = new ReportingObserver((reports, observer) => {
  reports.forEach(report => {
    if (report.type === types.deprecation) {
      console.debug(types.deprecation, report.body.toJSON());
    } else if (report.type === types.intervention) {
      console.debug(types.intervention, report.body.toJSON());
    } else if (report.type === types.cspViolation) {
      console.debug(types.cspViolation, report.body.toJSON());
    } else {
      console.debug(report);
    }
  });
}, options);

observer.observe();

if (typeof self.reportError === "function") {
  window.onerror = (message, source, lineno, colno, error) => {
    // console.debug(`message: ${message}`);
    // console.debug(`source: ${source}`);
    // console.debug(`lineno: ${lineno}`);
    // console.debug(`colno: ${colno}`);
    // console.debug(`error: ${error}`);
    return true;
  };

  self.addEventListener("error", (error) => {
    // console.debug(error);
  });

  const reportError = new Error("エラーだよ");
  self.reportError(reportError);
}
