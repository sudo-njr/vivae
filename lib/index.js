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
    path: undefined,
    method: "GET",
    middleware: function (vobj) {
      const filename = path.join(path.resolve(directory), vobj.path);
      const ext = path.extname(filename).toLowerCase();

      fs.stat(filename, (err, stats) => {
        if (err || !stats.isFile()) return vobj.next();

        fs.readFile(filename, "utf-8", (err, data) => {
          if (err) {
            vobj.respond(500).send("Internal Server Error");
            return;
          }

          if (ext && server?.config?.easyHeaders?.headers[ext]) {
            vobj.setHeaders(server.config.easyHeaders.headers[ext]);
          }

          vobj.send(data);
        });
      });
    },
  });
});

module.exports = vivae;
