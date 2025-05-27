"use strict";
const { applyConfig } = require("./utils/config.js");
const { createVobj } = require("./utils/vobj.js");
const methods = require("./utils/methods.js");
const http = require("http");

function vivae() {
  const middlewares = [];

  function server(req, res) {
    applyConfig(server);

    const vobj = createVobj(req, res, server, middlewares);
    vobj.next();
  }

  server.use = function (path, method, middleware) {
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

module.exports = vivae;
