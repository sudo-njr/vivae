"use strict";

function stackMsg(message) {
  const err = new Error(message);
  message = `[vivae]: ${message}`;

  if (err.stack) {
    const lines = err.stack.split("\n").slice(1);

    const exclusions = [
      "vivae/lib/utils",
      "vivae/lib",
      "node:events",
      "node:_http_server",
      "node:_http_common",
    ];

    const stack = lines.filter(
      (line) =>
        !exclusions.some((exclude) =>
          // rewrite paths for windows
          line.replace(/\\/g, "/").includes(exclude),
        ),
    );

    message += "\n" + stack.join("\n");
  }

  return message;
}

module.exports = stackMsg;
