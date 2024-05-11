import fs from "node:fs";
import { readdir, unlink, rm, copyFile,mkdir } from "node:fs/promises";
import path from "node:path";

const appName = process.env.APP_NAME;
if (!appName) {
  console.error("Error: unknown name");
  process.exit(1);
}

const ws = path.resolve(`${import.meta.dirname}`, "../");
if (path.basename(ws) !== appName) {
  console.error("Error: directory: %s", path.basename(ws));
  process.exit(1);
}

const paths = {
  src: `${ws}/src/app`,
  docs: `${ws}/docs`,
};

const del = async (docsPath) => {
  try {
    if (!fs.existsSync(docsPath)) return;

    const items = await readdir(docsPath, { withFileTypes: true });

    for await (const item of items) {
      const target = path.join(docsPath, item.name);
      if (item.isDirectory()) {
        await rm(target, { recursive: true });
      } else {
        await unlink(target);
      }
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

const copy = async (src, docs) => {
  try {
    await mkdir(docs, { recursive: true });

    const items = await readdir(src, { withFileTypes: true });

    for await (const item of items) {
      const srcPath = path.join(src, item.name);
      const docsPath = path.join(docs, item.name);

      if (item.isDirectory()) {
        await copy(srcPath, docsPath);
      } else {
        await copyFile(srcPath, docsPath);
      }
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

await del(paths.docs);
await copy(paths.src, paths.docs);
