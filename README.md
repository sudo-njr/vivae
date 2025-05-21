# Vivae
**Bring your HTTP server to life.**

Vivae is a lightweight, dependency-free Node.js framework designed to help you quickly build and manage HTTP servers with minimal code. Fun Fact: The name Vivae originates from Latin, the feminine plural form of vivus, meaning "alive" or "living." This reflects the framework's goal to bring your HTTP server to life.

## Features
- **Middleware Support**: Easily add custom middleware functions.
- **Automatic Content-Type Detection**: res.send() auto-detects and serializes arrays and objects, adjusting the Content-Type accordingly (defaults to "text/html").
- **Configurable Debugging**: Enable request logging with server.config.debug.logging.
- **Query Parameter Handling**: Control whether routes accept query parameters with server.config.allowQueries.
- **TypeScript Support**: Vivae includes type files so your IDE can detect functions.

## Roadmap
### Dynamic Routing
Implement support for dynamic routes, allowing parameters in paths like "/user/:id". This will enable more flexible API design.
### Easy Headers
**Making Static File Serving Smarter and Simpler**

I'm planning to enhance how Vivae handles static files by introducing a feature that lets you define headers for different file extensions. Here's what you can look forward to:
- Automatic MIME Type Detection: Vivae will intelligently assign the correct Content-Type based on file extensions. For example, ``.js`` files will be served as ``application/javascript``, ``.css`` as ``text/css``, and so on.
- Support for Custom and Uncommon File Types: Easily configure headers for less common file extensions. These can be served with application/octet-stream, but you can specify alternative MIME types as needed.
- Handling Pre-Compressed Files: Pre-Compressed File Handling: If you're serving pre-compressed files (such as, ``.gz``, ``.br``), Vivae will allow you to specify the appropriate ``Content-Encoding`` headers (gzip, br) to ensure browsers handle them correctly.
- Simple Configuration: You'll be able to map file extensions to their desired headers through a straightforward configuration, reducing the need for repetitive manual setups.
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
  console.log('Server running on http://localhost:3000');
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
