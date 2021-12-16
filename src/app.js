import express from "express";
const app = express();
const port = 3000;

app.use("/monaka", express.static("app"));

const server = app.listen(port, () => {
  const h = server.address().address;
  const p = server.address().port;
  console.log(`App listening at http://${h}:${p}`);
});
