import { applyConfig } from "./utils/config.js";
import http from "http";

function vivae() {
  const routes = [];
  const middlewares = [];

  function server(req, res) {
    applyConfig(server);

    req.path = req.url.match(/^[^?]*/)[0];

    res.setHeaders = function (headers) {
      if (typeof headers !== "object" || headers === null) {
        throw new Error("res.setHeaders expects an object with headers");
      }

      for (const key in headers) {
        res.setHeader(key, headers[key]);
      }
    };

    res.send = function (body) {
      if (!res.hasHeader("Content-Type")) {
        res.setHeader("Content-Type", "text/html");
      }

      if (typeof body === "object") {
        res.setHeader("Content-Type", "application/json");
        body = JSON.stringify(body);
      }

      res.statusCode = 200;
      res.end(body);
    };

    let index = 0;

    function next(err) {
      if (err) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }

      if (index < middlewares.length) {
        middlewares[index++](req, res, next);
        return;
      }

      for (const route of routes) {
        if (
          route.method === req.method &&
          route.path === (server.config?.allowQueries ? req.path : req.url)
        ) {
          route.handler(req, res);
          return;
        }
      }

      res.writeHead(404);
      res.end("Not Found");
    }

    next();
  }

  server.use = function (fn) {
    middlewares.push(fn);
  };

  server.add = function (path, method, handler) {
    if (typeof method === "function") {
      handler = method;
      method = "GET";
    }
    routes.push({ path, method, handler });
  };

  server.listen = function (port, cb) {
    if (server.config?.debug?.logging) {
      server.use((req, res, next) => {
        console.log(req.method, req.url);
        next();
      });
    }
    http.createServer(server).listen(port, cb);
  };

  return server;
}

export default vivae;
