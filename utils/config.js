export const defaultConfig = {
  allowQueries: true,
};

export function applyConfig(server, defaults = defaultConfig) {
  server.config = server.config || {};

  for (const key in defaults) {
    if (typeof defaults[key] === "object" && defaults[key] !== null) {
      server.config[key] = { ...defaults[key] };
    } else {
      server.config[key] = defaults[key];
    }
  }
}
