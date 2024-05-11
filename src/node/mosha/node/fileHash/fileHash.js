import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const getHash = (path) => new Promise((resolve, reject) => {
  const hash = crypto.createHash('sha256');
  const rs = fs.createReadStream(path);
  rs.on('error', reject);
  rs.on('data', chunk => hash.update(chunk));
  rs.on('end', () => resolve(hash.digest('hex')));
});

try {
  const fileName = "sample.txt";
  const file = path.resolve(`${import.meta.dirname}`, fileName);
  if (!fs.existsSync(file)) throw new Error('File Not Found');

  const hashValue = await getHash(file);
  console.log(hashValue);
} catch (error) {
  console.error(`Error: ${error}`);
}
