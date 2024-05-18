import express from "express";
import http from "node:http";
import path from "node:path";
import url from "node:url";

const app = express();
const httpPort = 3000;
const router = express.Router();

router.use((req, res, next) => {
  res.set(`Cache-control`, `no-store`);
  res.set(`Pragma`, `no-cache`);
  res.set(`Expires`, 0);
  res.set(`Referrer-Policy`, `strict-origin-when-cross-origin`);
  res.set(`X-Content-Type-Options`, `nosniff`);
  res.set(`X-Frame-Options`, `DENY`);
  res.set(`Strict-Transport-Security`, `max-age=31536000; includeSubDomains`);
  res.set(`Cross-Origin-Resource-Policy`, `same-origin`);
  res.set(`Cross-Origin-Opener-Policy`, `same-origin`);
  res.set(`Cross-Origin-Embedder-Policy`, `require-corp`);
  res.set(`Permissions-Policy`, `screen-wake-lock=(self)`);
  next();
});

app.use(`/monaka`, router, express.static(`app`));

app.get('/monaka/clear', (req, res, next) => {
  res.set(`Clear-Site-Data`, `"cache", "cookies", "storage", "executionContexts"`);
  res.sendFile(path.dirname(url.fileURLToPath(import.meta.url)) + '/app/clear.html');
})

const httpServer = http.createServer(app).listen(httpPort, () => {
  const h = httpServer.address().address;
  const p = httpServer.address().port;
  console.log(`App listening at http://${h}:${p}`);
});
