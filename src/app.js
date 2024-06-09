import express from "express";
import http from "node:http";
import path from "node:path";
import url from "node:url";
import limiter from "./express/middleware/rateLimit.js";
import speedLimiter from "./express/middleware/slowDown.js";
import responseHeader from "./express/middleware/responseHeader.js";
import csrf from "./express/middleware/csrf.js";
import session from "./express/middleware/session.js";
import clear from "./express/routes/clear.js";

const app = express();
const httpPort = 3000;
const router = express.Router();

// router.use(speedLimiter);
// router.use(limiter);
// router.use(csrf);
// router.use(session);
router.use(responseHeader);

app.use(`/monaka`, router, express.static(`app`));
app.get('/monaka/clear', clear);

const httpServer = http.createServer(app).listen(httpPort, () => {
  const h = httpServer.address().address;
  const p = httpServer.address().port;
  console.log(`App listening at http://${h}:${p}`);
});
