"use strict";
const defaultConfig = {
  allowQueries: true,
  easyHeaders: {
    autoEncoding: false,
    headers: {
      ".html": { "Content-Type": "text/html" },
      ".css": { "Content-Type": "text/css" },
      ".txt": { "Content-Type": "text/plain" },
      ".js": { "Content-Type": "application/javascript" },
      ".json": { "Content-Type": "application/json" },
      ".png": { "Content-Type": "image/png" },
      ".jpg": { "Content-Type": "image/jpeg" },
      ".jpeg": { "Content-Type": "image/jpeg" },
      ".gif": { "Content-Type": "image/gif" },
      ".svg": { "Content-Type": "image/svg+xml" },
      ".webp": { "Content-Type": "image/webp" },
      ".ico": { "Content-Type": "image/x-icon" },
      ".woff": { "Content-Type": "font/woff" },
      ".woff2": { "Content-Type": "font/woff2" },
      ".ttf": { "Content-Type": "font/ttf" },
      ".otf": { "Content-Type": "font/otf" },
      ".mp4": { "Content-Type": "video/mp4" },
      ".webm": { "Content-Type": "video/webm" },
      ".pdf": { "Content-Type": "application/pdf" },
      ".zip": { "Content-Type": "application/zip" },
      ".gz": {
        "Content-Encoding": "gzip",
        "Content-Type": "application/octet-stream",
      },
      ".br": {
        "Content-Encoding": "br",
        "Content-Type": "application/octet-stream",
      },
    },
  },
};

function applyConfig(server, defaults = defaultConfig) {
  server.config = server.config || {};

  for (const key in defaults) {
    if (typeof defaults[key] === "object" && defaults[key] !== null) {
      server.config[key] = { ...defaults[key] };
    } else {
      server.config[key] = defaults[key];
    }
  }
}

module.exports = { defaultConfig, applyConfig };
