# Vivae

**Bring your HTTP server to life.**

Vivae is a lightweight, dependency-free Node.js framework designed to help you quickly build and manage HTTP servers with minimal code. View the [docs](https://github.com/sudo-njr/vivae/blob/main/docs/index.md).

**Fun fact:** The name Vivae comes from Latin. It’s the feminine plural of Vivus, meaning "alive," and that’s the goal of this framework; to bring your HTTP server to life.

## Features

- Configuration
- Adding middleware
- Plugin Creation
- Static Serving
- TypeScript support
- CommonJS and ESM support

## Performance

Vivae uses less memory and is more stable than Express or Koa.

- Vivae: ~31.55 MB RSS
- Express v5.1.0: ~43.45 MB
- Koa v3.0.0: ~43.71 MB

Vivae is a better option than either frameworks for high efficient and resource sensitive applications. Tracked using Node's `process.memoryUsage()`.

## Installation

```
npm install vivae
```

## Usage Example

ESM:

```javascript
import vivae from "vivae";

const app = vivae();
const port = 3000;

app.use("/", "GET", (vobj) => {
  vobj.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

If you're using CommonJS, simply use `require` instead of `import`:

```javascript
const vivae = require("vivae");
```

## License

[MIT](https://github.com/sudo-njr/vivae/blob/main/LICENSE)
