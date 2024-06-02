const clear = (req, res, next) => {
  res.set(`Clear-Site-Data`, `"cache", "cookies", "storage", "executionContexts"`);
  res.sendFile(path.dirname(url.fileURLToPath(import.meta.url)) + '/app/clear.html');
};

export default clear;
