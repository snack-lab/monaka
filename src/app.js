import express from "express";
import http from "http";
import https from "https";
import fs from "fs";

const app = express();
const httpPort = 3000;
const httpsPort = 3001;
const router = express.Router();

// const options = {
//   key: fs.readFileSync("./privatekey.pem"),
//   cart: fs.readFileSync("./cert.pem")
// }

router.use((req, res, next) => {
  res.set('Cache-control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', 0);
  next();
});

app.use("/monaka", router, express.static("app"));

const httpServer = http.createServer(app).listen(httpPort, () => {
  const h = httpServer.address().address;
  const p = httpServer.address().port;
  console.log(`App listening at http://${h}:${p}`);
});

// const httpsServer = https.createServer(app).listen(httpPort, () => {
//   const h = httpsServer.address().address;
//   const p = httpsServer.address().port;
//   console.log(`App listening at https://${h}:${p}`);
// });
