# API Reference

Welcome to Vivae's API Reference.

## Server Instance - `vivae(config)`

In this documentation, `[server]` will refer to your server instance.

```javascript
import vivae from "vivae";

const app = vivae(); // [server]
```

You can modify how your server behaves by passing an object when the instance is created.

### Example

```javascript
const app = vivae({
  debug: {
    logging: true,
  },
});
```

### `.debug`

### `.allowQueries`

## Route Handler - `[server]`.use()

The route handler defines how your HTTP server handles each path and it's assosiated method. It accepts three arguments, the path, method and middleware. It can be structured in any way possible but is recommended to be structued like this:

```javascript
[server].use(PATH, METHOD, MIDDLEWARE);
```

- `PATH` (optional): Defines what path on the server to apply to, you can leave it empty to apply to all paths. Supports:
  - Static Paths: e.g. `/`, `/about`
  - Parameterized paths: e.g. `/user/:id`, `/blog/:post_id`
    - Accessible through [`vobj.params`](#params)
  - Strict Wildcards `*`: Matches **one or more segments**
  - Dual Wildcards `%` | `**`: Matches **zero or more segments**
- `METHOD` (optional): The HTTP method, not case sensitive, so it doesn't need to be capitalized. It also supports an array of methods if you want to apply the request to multiple types. See [all HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods). Defaults to all HTTP methods if it's not given.
- `MIDDLEWARE` (required): A function that allows you to write middleware, includes `vobj` object.

### Example

```javascript
[server].use(["GET", "POST"], "/about", (vobj) => {
  vobj.send("Hello World!");
});
```

## Vivae Object

The Vivae Object (`vobj`) is a unified version of Node.js's `req` and `res` only available when writing middleware. The `vobj` object can be accessed like this:

```javascript
[server].use((vobj) => {
  // vobj can be used here
});
```

### `.url`

Returns a string including the path and query.

### `.path`

Same as `.url` except the query is excluded.

### `.query`

If the current URL has a query, then Vivae will parse it into an object.

### `.params`

Access the parameters from the current request parsed into an object.

### `.method`

Get the current request method. Changing it doesn't rewrite the method sent to the server.

```javascript
[server].use("/", "GET", (vobj) => {
  vobj.send(vobj.method); // "GET"
});
```

### `.status`

Allows you to send status codes to the browser of the current request.

Example:

```javascript
vobj.status = 404;
```

### `.send()`

Example:

```javascript
vobj.send("Hello world!");
```

### `.next()`

### `.setHeaders()`

Adds headers to the current request.

Example:

```javascript
vobj.setHeaders({ "Content-Type": "application/json" });
```

### `.respond()`

Combines `.status` and `.setHeaders()` into one, allowing you to make your code more readable.

Example:

```javascript
vobj.respond(200, { "Content-Type": "application/json" });
```

### `.on()`

### `.once()`

### `.off()`

## Server Listener - `[server]`.listen

# Plugin API

## Create Plugin - createPlugin()

```javascript
import { createPlugin } from "vivae/plugins";

createPlugin(FUNCTION);
```

- `FUNCTION`: Add any argument and return middleware. It's very similar to `[server].use()` except you can use it almost anywhere or create your own package for others to use.

### Example

```javascript
import { createPlugin } from "vivae/plugins";

const myPlugin = createPlugin((message) => {
  console.log(message);
  return (server) => ({
    path: "/api/user/:userId",
    method: "POST",
    middleware: function (vobj) {
      vobj.send({ message, userId: vobj.params.userId });
    },
  });
});

export default myPlugin;
```

## Static Serving - serve()

```javascript
import { serve } from "vivae/plugins";

serve(DIRECTORY, OPTIONS);
```

- `DIRECTORY`: The directory of your choice to serve publicly.
- `OPTIONS` (optional): You can pass an object to change how static serving behaves.
  - `.autoEncoding` (optional): Detect Gzip encoding in files automatically. Brotli is not supported because it doesn't have a magic number in it's buffer for detection.
  - `.headers` (optional): Decide what headers to apply depending on the file extension. This plugin applies defaults so you can only change or add to what it's currently set to.

### Example

```javascript
serve("public", {
  autoEncoding: false,
  headers: {
    ".unityweb": {
      "Content-Encoding": "gzip",
      "Content-Type": "application/octet-stream",
    },
  },
});
```
