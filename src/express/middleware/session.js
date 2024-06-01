import session from "express-session";

const options = {
  secret: 'monaka sample',
  cookie: { sameSite: "lax" }
}

export default session(options);
