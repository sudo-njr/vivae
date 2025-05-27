"use strict";
const stackMsg = require("./stackMsg.js");
const fs = require("fs");

function createVobj(req, res, server, middlewares) {
  let index = 0;

  const vobj = {
    path: req.url?.match(/^[^?]*/)[0],
    method: req.method?.toUpperCase(),
    status: 200,
    setHeaders(headers) {
      for (const key in headers) {
        res.setHeader(key, headers[key]);
      }
    },
    respond(status, headers) {
      if (typeof status === "undefined" && typeof headers === "undefined") {
        console.warn(stackMsg("vobj.respond() called with no arguments."));
      }

      if (headers) this.setHeaders(headers);
      if (status) this.status = status;
      // chaining support
      return this;
    },
    route(path, method) {
      if (path) this.path = path;
      if (method) this.method = method.toUpperCase();
      this.next();
    },
    send(body) {
      const extMatch = this.path.match(/(\.[^.?#]+)(?:[?#]|$)/);
      const ext = extMatch ? extMatch[1].toLowerCase() : null;

      if (ext && server.config?.easyHeaders?.headers?.[ext]) {
        this.setHeaders(server.config.easyHeaders.headers[ext]);
      }

      if (!res.getHeader("Content-Type")) {
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
            this.setHeaders({
              "Content-Encoding": "gzip",
              "Content-Type": "application/octet-stream",
            });
          }
        } else {
          res.setHeader("Content-Type", "text/html");
        }
      }

      if (typeof body === "object") {
        res.setHeader("Content-Type", "application/json");
        body = JSON.stringify(body);
      }

      res.statusCode = this.status;
      res.end(body);
    },
    next(err) {
      if (err) {
        res.writeHead(500);
        return res.end("Internal Server Error");
      }

      while (index < middlewares.length) {
        const { path, method, middleware } = middlewares[index++];

        if (
          (!path || vobj.path === path) &&
          (!method || vobj.method === method)
        ) {
          try {
            return middleware(vobj);
          } catch (e) {
            return this.next(e);
          }
        }
      }

      res.writeHead(404);
      return res.end("Not Found");
    },
  };

  return vobj;
}

module.exports = { createVobj };
