# Vivae

**Bring your HTTP server to life.**

Vivae is a lightweight, dependency-free Node.js framework designed to help you quickly build and manage HTTP servers with minimal code.

**Fun fact:** The name Vivae comes from Latin. It’s the feminine plural of Vivus, meaning "alive," and that’s the goal of this framework; to bring your HTTP server to life.

## Features

- **Middleware Support**: Easily add custom middleware functions.
- **Content-Type Detection**: res.send() auto-detects and serializes arrays and objects, adjusting the Content-Type accordingly.
- **Configuration**: Enable and disable several built in options including our logging feature or to allowing queries in the router.
- **TypeScript Support**: Vivae includes type files so your IDE can detect functions.

## Roadmap

### More Content-Type Detection

I'm planning to make the framework more advanced by checking if the requested file exists, and if it does update the Content-Type header depending on the file extension.

### Dynamic Routing

Implement support for dynamic routes, allowing parameters in paths like "/user/:id". This will enable more flexible API design.

### Easy Headers

Introducing a feature built into configuration that lets you define and modify headers to include for file extensions allowing you to add headers to unknown file types. With this you might be able to expect a gzip and brotli auto detection which can be turned on. You can also add it manually with `Content-Encoding` headers (gzip, br) to ensure browsers handle them correctly.

### Framework Support

Extend Vivae's capabilities to support rendering and serving frontend frameworks such as React, building the front-end for you and allowing you to setup a backend.

## Installation

```
npm install vivae
```

## Usage Example

```javascript
import vivae from "vivae";

const app = vivae();

app.add("/api", "POST", (req, res) => {
  res.send({ currentPath: req.path });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

## Configuration

```javascript
const app = vivae();
app.config = {
  debug: {
    logging: true,
  },
  allowQueries: false,
};
```

## Tests

Looking to contribute? You can easily test it out with our built-in node scripts:

```
npm test
```

## License

This code is licensed by [MIT](https://github.com/sudo-njr/vivae/blob/main/LICENSE)
