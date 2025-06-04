# API Reference

Welcome to Vivae's API Reference.

## What is `[server]`?

In this documentation, `[server]` refers to your Vivae server instance. You typically create this instance by importing Vivae and calling it like this:

```javascript
import vivae from "vivae";

const app = vivae();
```

Here, `app` is your Vivae server instance, so anywhere you see `[server]` in the docs, it means this instance. You can name your server instance anything, but `app` is the most adopted when naming HTTP servers.

## Configuration - `[server]`.config

### `.debug`

### `.allowQueries`

### `.easyHeaders`

## Route Handler - `[server]`.use()

The route handler defines how your HTTP server handles each path and it's assosiated method. It's structured like so:

```javascript
[server].use(PATH, METHOD, MIDDLEWARE);
```

- `PATH` (optional): Defines what path on the server to apply to, you can leave it empty to apply to all paths.
- `METHOD` (optional): The HTTP method, not case sensitive, so it doesn't need to be capitalized. See [all HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods). Defaults to all HTTP methods if it's not given.
- `MIDDLEWARE` (required): A function that allows you to write middleware, includes `vobj` object.

## Vivae Object

The Vivae Object (`vobj`) is a unified version of Node.js's `req` and `res` only available when writing middleware. The `vobj` object can be accessed like this:

```javascript
[server].use((vobj) => {
  // vobj can be used here
});
```

### `.path`

### `.method`

### `.status`

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

Example:

```javascript
vobj.setHeaders({ "Content-Type": "application/json" });
```

### `.respond()`

Example:

```javascript
vobj.respond(200, { "Content-Type": "application/json" });
```

### `.on()`

### `.once()`

### `.off()`

## Server Listener - `[server]`.listen

## Static Serving - `[server]`.serve()
