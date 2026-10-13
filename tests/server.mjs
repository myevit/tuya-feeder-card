import http from "node:http";
import fs from "node:fs";
http
  .createServer((req, res) => {
    if (req.url === "/dist/tuya-feeder-card.js") {
      res.setHeader("Content-Type", "text/javascript");
      res.end(fs.readFileSync("dist/tuya-feeder-card.js"));
    } else {
      res.end(
        '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui;margin:16px;background:#f2f2f7;--primary-color:#007aff;--card-background-color:#fff;--primary-text-color:#202124;--secondary-text-color:#666}tuya-feeder-card{display:block;max-width:480px}</style></head><body><p>MOCK · synthetic data · not live Home Assistant</p><script type="module" src="/dist/tuya-feeder-card.js"></script></body></html>',
      );
    }
  })
  .listen(4173, "127.0.0.1");
