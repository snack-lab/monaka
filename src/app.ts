import express, { type Express } from 'express';

import responseHeader from "./express/middleware/responseHeader.ts";
import csrf from "./express/middleware/csrf.ts";
import clear from "./express/routes/clear.ts";

const app: Express = express();
const port = 3000;
const router = express.Router();

router.use(csrf);
router.use(responseHeader);

app.use(`/monaka`, router, express.static(`app`));
app.get('/monaka/clear', clear);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
