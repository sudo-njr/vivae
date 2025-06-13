"use strict";

const methods = [
  // HTTP/1.1
  // RFC 9110
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "CONNECT",
  "OPTIONS",
  "TRACE",
  // RFC 5789
  "PATCH",
  // WebDAV
  // RFC 4918
  "PROPFIND",
  "PROPPATCH",
  "MKCOL",
  "COPY",
  "MOVE",
  "LOCK",
  "UNLOCK",
];

module.exports = methods;
