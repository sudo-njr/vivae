"use strict";
const { applyConfig } = require("./utils/config.js");
const { createVobj } = require("./utils/vobj.js");
const { createPlugin } = require("./plugins.js");
const methods = require("./utils/methods.js");
const http = require("http");
const path = require("path");
const fs = require("fs");

function vivae() {
  const middlewares = [];

  function server(req, res) {
    applyConfig(server);

    const vobj = createVobj(req, res, middlewares);
    vobj.next();
  }

  server.use = function (path, method, middleware) {
    if (path?.plugin && typeof path.init === "function") {
      const plugin = path.init(server);
      return server.use(plugin.path, plugin.method, plugin.middleware);
    }

    if (typeof path === "function") {
      middleware = path;
      method = undefined;
      path = undefined;
    } else if (typeof method === "function") {
      if (typeof path === "string" && methods.includes(path.toUpperCase())) {
        middleware = method;
        method = path.toUpperCase();
        path = undefined;
      } else {
        middleware = method;
        method = undefined;
      }
    }

    middlewares.push({ path, method, middleware });
  };

  server.listen = function (port, cb) {
    if (server.config?.debug?.logging) {
      server.use((vobj) => {
        console.log(vobj.method, vobj.path);
        vobj.next();
      });
    }
    http.createServer(server).listen(port, cb);
  };

  return server;
}

vivae.serve = createPlugin((directory) => {
  return (server) => ({
    middleware: function (vobj) {
      try {
        const filename = path.join(path.resolve(directory), vobj.path);
        const ext = path.extname(filename).toLowerCase();

        const data = fs.readFileSync(filename, "utf-8");

        if (ext && server?.config?.easyHeaders?.headers[ext]) {
          vobj.setHeaders(server.config.easyHeaders.headers[ext]);
        }

        if (server?.config?.easyHeaders?.autoEncoding) {
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

module.exports = vivae;
