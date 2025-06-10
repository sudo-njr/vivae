/*!
 * vivae
 * (c) 2025 sudo-njr
 * Licensed by MIT
 */

"use strict";
const { defaults } = require("./utils/config.js");
const { createVobj } = require("./utils/vobj.js");
const methods = require("./utils/methods.js");
const http = require("http");

function vivae(config = defaults) {
  const middlewares = [];

  function server(req, res) {
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
    if (config.debug?.logging) {
      server.use((vobj) => {
        console.log(vobj.method, vobj.path);
        vobj.next();
      });
    }
    http.createServer(server).listen(port, cb);
  };

  return server;
}

module.exports = vivae;
