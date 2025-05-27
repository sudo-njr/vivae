type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

interface VivaeObject {
  path: string;
  method: Method;
  send(body: string | object): void;
  next(err?: any): void;
}

type Middleware = (vobj: VivaeObject) => void;

interface VivaeConfig {
  debug?: {
    logging?: boolean;
  };
  allowQueries?: boolean;
  easyHeaders?: {
    autoEncoding?: boolean;
    headers?: {
      [fileExtension: string]: {
        [header: string]: string;
      };
    };
  };
}

interface VivaeServer {
  config?: VivaeConfig;

  use(path: string, method: Method, middleware: Middleware): void;
  use(path: string, middleware: Middleware): void;
  use(middleware: Middleware): void;

  listen(port: number, callback?: () => void): void;
}

declare function vivae(): VivaeServer;

export = vivae;
