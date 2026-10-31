const appOrigin = process.env.APP_URL;
import type { Request, Response, NextFunction } from "express";

const csrf = (req: Request, res: Response, next: NextFunction) => {
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
