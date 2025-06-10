"use strict";
const path = require("path");
const fs = require("fs");

function createPlugin(fn) {
  return (...args) => ({
    plugin: true,
    init(server) {
      return fn(...args)(server);
    },
  });
}

const serve = createPlugin((directory) => {
  return (server) => ({
    middleware: function (vobj) {
      try {
        const filename = path.join(path.resolve(directory), vobj.path);
        const ext = path.extname(filename).toLowerCase();

        const data = fs.readFileSync(filename, "utf-8");

        if (ext && config.easyHeaders?.headers[ext]) {
          vobj.setHeaders(server.config.easyHeaders.headers[ext]);
        }

        if (config.easyHeaders?.autoEncoding) {
          const fd = fs.openSync(filename, "r");
          const buffer = Buffer.alloc(4);
          fs.readSync(fd, buffer, 0, 4, 0);
          fs.closeSync(fd);
          if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
            vobj.setHeaders({
              "Content-Encoding": "gzip",
              "Content-Type": "application/octet-stream",
            });
          }
        }

        vobj.send(data);
      } catch (err) {
        vobj.next();
      }
    },
  });
});

module.exports = {
  createPlugin,
  serve,
};
