# Vivae

**Bring your HTTP server to life.**

Vivae is a lightweight, dependency-free Node.js framework designed to help you quickly build and manage HTTP servers with minimal code. View the [docs](https://github.com/sudo-njr/vivae/blob/main/docs/index.md).

**Fun fact:** The name Vivae comes from Latin. It’s the feminine plural of Vivus, meaning "alive," and that’s the goal of this framework; to bring your HTTP server to life.

## Features

- Configuration
- Adding middleware
- Content-Type Detection
- TypeScript support

## Installation

```
npm install vivae
```

## Usage Example

```javascript
import vivae from "vivae";

const app = vivae();
const port = 3000;

app.use("/", "GET", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

## License

[MIT](https://github.com/sudo-njr/vivae/blob/main/LICENSE)
