const { applyConfig } = require("./utils/config.js");
const methods = require("./utils/methods.js");
const http = require("http");
const fs = require("fs");

function vivae() {
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

      if (index >= middlewares.length) {
        res.writeHead(404);
        res.end("Not Found");
        return;
      }

      const { path, method, middleware } = middlewares[index++];

      if (
        !path ||
        ((server.config?.allowQueries ? req.path === path : req.url === path) &&
          !method) ||
        req.method.toUpperCase() === method.toUpperCase()
      ) {
        middleware(req, res, next);
      } else {
        next();
      }
    }

    next();
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
      server.use((req, res, next) => {
        console.log(req.method, req.url);
        next();
      });
    }
    http.createServer(server).listen(port, cb);
  };

  return server;
}

module.exports = vivae;
