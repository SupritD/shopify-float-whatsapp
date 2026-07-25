import { createRequestListener } from "@react-router/node";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import * as build from "./build/server/index.js";

const clientDir = path.join(process.cwd(), "build/client");
const ssrListener = createRequestListener({ build });
const port = process.env.PORT || 3000;

const mimeTypes = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const filePath = path.join(clientDir, urlPath);

    if (
      urlPath !== "/" &&
      filePath.startsWith(clientDir) &&
      fs.existsSync(filePath) &&
      fs.statSync(filePath).isFile()
    ) {
      const ext = path.extname(filePath);
      res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    ssrListener(req, res);
  })
  .listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
