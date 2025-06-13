// 31.57, 31.51, 31.57 ~ 31.55MB
const vivae = require("../lib/index.js");
const app = vivae();

app.listen(3000, () => {
  console.log((process.memoryUsage().rss / 1024 / 1024).toFixed(2));
});
