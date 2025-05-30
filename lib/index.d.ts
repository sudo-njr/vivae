type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

type Event = {
  data: (chunk: Buffer | string) => void;
  end: () => void;
  error: (err: Error) => void;
  close: () => void;
  aborted: () => void;
};

interface VivaeObject {
  path: string;
  method: Method;
  status: number;

  send(body: string | object): void;
  next(err?: any): void;

  setHeaders(headers: { [key: string]: string }): void;

  respond(options: {
    status?: number;
    headers?: { [key: string]: string };
  }): this;

  on<E extends keyof Event>(event: E, listener: Event[E]): this;
  once<E extends keyof Event>(event: E, listener: Event[E]): this;
  off<E extends keyof Event>(event: E, listener: Event[E]): this;
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
