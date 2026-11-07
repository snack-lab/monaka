import express, { type Express } from 'express';
import rateLimit from 'express-rate-limit';

import responseHeader from "./express/middleware/responseHeader.ts";
import csrf from "./express/middleware/csrf.ts";
import clear from "./express/routes/clear.ts";

const app: Express = express();
const port = 3000;
const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  statusCode: 429,
  message: 'リクエスト数が制限を超えました。しばらく待ってから再度お試しください。',
  ipv6Subnet: 60,
});

router.use(limiter);
router.use(csrf);
router.use(responseHeader);

app.use(`/monaka`, router, express.static(`app`));
app.get('/monaka/clear', clear);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
