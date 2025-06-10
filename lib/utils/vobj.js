"use strict";
const stackMsg = require("./stackMsg.js");

function createVobj(req, res, middlewares) {
  let index = 0;

  const vobj = {
    url: req.url,
    path: req.url?.split("?")[0],
    get query() {
      const queries = decodeURIComponent(req.url?.split("?")[1] || "");

      if (queries) {
        const query = {};
        const pairs = queries.split("&");

        for (const pair of pairs) {
          if (!pair) continue;

          let [key, value] = pair.split("=");

          if (typeof value === "undefined") value = "";

          function parseString(str) {
            if (
              (str.startsWith('"') && str.endsWith('"')) ||
              (str.startsWith("'") && str.endsWith("'"))
            ) {
              // remove quotes, stays a string
              return str.slice(1, -1);
            }
            return str;
          }

          key = parseString(key);
          value = parseString(value);

          if (value === "true") {
            value = true;
          } else if (value === "false") {
            value = false;
            // make sure it can become a number and isn't an empty string
          } else if (!isNaN(value) && value.trim() !== "") {
            value = Number(value);
          }

          query[key] = value;
        }

        return query;
      } else {
        return {};
      }
    },
    method: req.method?.toUpperCase(),
    on: req.on.bind(req),
    once: req.once.bind(req),
    off: req.off.bind(req),
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
      if (typeof body === "object") {
        res.setHeader("Content-Type", "application/json");
        body = JSON.stringify(body);
      }

      if (!res.getHeader("Content-Type")) {
        res.setHeader("Content-Type", "text/html");
      }

      res.statusCode = this.status;
      res.end(body);
    },
    next(err) {
      if (err) {
        this.status = 500;
        return this.send("Internal Server Error");
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

      this.status = 404;
      return this.send("Not Found");
    },
  };

  return vobj;
}

module.exports = { createVobj };
