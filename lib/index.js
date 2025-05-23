import { applyConfig } from "./utils/config.js";
import http from "http";
import fs from "fs";

function vivae() {
  const routes = [];
  const middlewares = [];

  function server(req, res) {
    applyConfig(server);

    req.path = req.url.match(/^[^?]*/)[0];
    res.send = function (body) {
      const extMatch = req.path.match(/(\.[^.?#]+)(?:[?#]|$)/);
      const ext = extMatch ? extMatch[1].toLowerCase() : null;

      if (ext && server.config?.easyHeaders?.headers?.[ext]) {
        const headers = server.config.easyHeaders.headers[ext];
        for (const key in headers) {
          if (!res.hasHeader(key)) {
            res.setHeader(key, headers[key]);
          }
        }
      }

      if (!res.hasHeader("Content-Type")) {
        if (
          server.config?.easyHeaders?.autoEncoding &&
          typeof body === "string" &&
          fs.existsSync(body) &&
          ext &&
          !server.config?.easyHeaders?.headers?.[ext]
        ) {
          const fd = fs.openSync(body, "r");
          const buffer = Buffer.alloc(4);
          fs.readSync(fd, buffer, 0, 4, 0);
          fs.closeSync(fd);

          if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
            res.setHeader("Content-Encoding", "gzip");
            res.setHeader("Content-Type", "application/octet-stream");
          }
        } else {
          res.setHeader("Content-Type", "text/html");
        }
      } else if (typeof body === "object") {
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

  server.create = function (path, method, handler) {
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
