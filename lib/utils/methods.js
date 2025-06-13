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
  // RFC 3253
  "VERSION-CONTROL",
  "REPORT",
  "CHECKIN",
  "CHECKOUT",
  "UNCHECKOUT",
  "MKWORKSPACE",
  "UPDATE",
  "LABEL",
  "MERGE",
  "BASELINE-CONTROL",
  "MKACTIVITY",
  // RFC 3744
  "ACL",
  // RFC 5323
  "SEARCH",
];

module.exports = methods;
