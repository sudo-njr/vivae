## Installing

Vivae is a package on npm, you'll need to have [Node.js 18](https://nodejs.org/en/download) or higher for it to function properly. To begin, create a folder called "vivae-app" and enter the directory.

```
mkdir vivae-app
cd vivae-app
```

After the folder is set up you'll want to setup a `package.json` file by running `npm init`. Check out [configuring a package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json) on npm's docs.

```
npm init
```

Then install Vivae by using:

```
npm install vivae
```
## Using Vivae

Create a file named `index.js` with this example code to understand it's functionality.

```javascript
import vivae from "vivae";

const app = vivae();
const port = 3000;

// Turn on request logging (Optional)
app.config = {
  debug: {
    logging: true,
  },
};

app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", "POST", (req, res) => {
  // Also supports JSON objects and arrays, Vivae will handle it automatically.
  res.send([{ path: req.path }]);
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

### Running the example app

To run it, paste this line to the terminal and your server will start instantaneously. Optionally you can add this to your `package.json`.

```
node index.js
```

### Using Vivae's route handler
If you noticed there was a specific structure to add new routes. The route handler defines how your HTTP server handles each path and it's assosiated method. It's structured like so:
```
[server].use(PATH, METHOD, MIDDLEWARE)
```

- `[server]` represents whatever Vivae instance you chose, in the example app this would be `app`.
- `PATH` is optional and defines what path on the server to apply to, you can leave it empty to apply to all paths.
- `METHOD` completely optional, must be in all caps see [all HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods). Defaults to "GET".
- `MIDDLEWARE` includes `req`, `res`, and `next`, allows you to write middleware for specific routes and methods.
