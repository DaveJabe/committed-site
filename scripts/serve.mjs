// Serves dist/ under the configured base path, like GitHub Pages does: npm run preview
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import config from "../site.config.mjs";

const root = new URL("../dist/", import.meta.url).pathname;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".zip": "application/zip", ".json": "application/json" };
const port = Number(process.env.PORT || 4321);

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!path.startsWith(config.basePath)) { res.writeHead(302, { location: config.basePath }); return res.end(); }
  let file = normalize(join(root, path.slice(config.basePath.length)));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) { res.writeHead(404, { "content-type": types[".html"] }); return res.end(readFileSync(join(root, "404.html"))); }
  res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`http://localhost:${port}${config.basePath}`));
