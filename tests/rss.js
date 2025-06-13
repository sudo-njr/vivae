// 31.57, 31.51, 31.57 ~ 31.55MB
const vivae = require("../lib/index.js");
const app = vivae();

app.listen(3000, () => {
  console.log((process.memoryUsage().rss / 1024 / 1024).toFixed(2));
});

/* Express v5.1.0: 43.29, 43.52, 43.55 ~ 43.45MB
const express = require("express");
const app = express();
*/

/* Koa v3.0.0: 43.86, 43.59, 43.68 ~ 43.71MB
const Koa = require("koa");
const app = new Koa();
*/
