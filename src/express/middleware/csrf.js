const appOrigin = process.env.APP_URL;
const csrf = (req, res, next) => {
  if (req.method === "post") {
    if (req.headers.origin !== appOrigin) {
      return res.status(400).send("Error");
    }
    if (req.headers.secFetchSite && req.headers.secFetchSite !== "same-origin") {
      return res.status(400).send("Error");
    }
  }
  return next();
}

export default csrf;
