const header = {
  "Cache-control": "no-store",
  "Pragma": "no-cache",
  "Expires": 0,
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Permissions-Policy": "screen-wake-lock=(self)"
};

const responseHeader = (req, res, next) => {
  res.set(header);
  next();
}

export default responseHeader;
