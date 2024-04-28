import express from "express";
import http from "http";

const app = express();
const httpPort = 3000;
const router = express.Router();

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
