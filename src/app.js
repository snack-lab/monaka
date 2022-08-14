import express from "express";
const app = express();
const port = 3000;
const router = express.Router();

router.use((req, res, next) => {
  res.set('Cache-control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', 0);
  next();
});

app.use("/monaka", router, express.static("app"));

const server = app.listen(port, () => {
  const h = server.address().address;
  const p = server.address().port;
  console.log(`App listening at http://${h}:${p}`);
});
