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
    const vobj = createVobj(req, res, middlewares, config);
    vobj.next();
  }

  server.use = function (arg1, arg2, arg3) {
    if (arg1?.plugin && typeof arg1?.init === "function") {
      const plugin = arg1.init(server);
      return server.use(plugin.path, plugin.method, plugin.middleware);
    }

    let path;
    let method;
    let middleware;

    [arg1, arg2, arg3].forEach((arg) => {
      if (arg !== undefined) {
        if (typeof arg === "string") {
          if (methods.includes(arg)) {
            method = [arg];
          } else {
            path = arg;
          }
        } else if (Array.isArray(arg)) {
          method = arg;
        } else if (typeof arg === "function") {
          middleware = arg;
        }
      }
    });

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
