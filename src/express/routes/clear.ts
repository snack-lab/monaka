import path from "node:path";
import url from "node:url";
import { type Request, type Response } from "express";

const clear = (req: Request, res: Response) => {
  res.set(`Clear-Site-Data`, `"cache", "cookies", "storage", "executionContexts"`);
  res.sendFile(path.dirname(url.fileURLToPath(import.meta.url)) + '/app/clear.html');
};

export default clear;
