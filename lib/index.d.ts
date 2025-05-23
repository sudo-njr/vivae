import { IncomingMessage, ServerResponse } from "http";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

interface VivaeRequest extends IncomingMessage {
  path?: string;
  [key: string]: any;
}

interface VivaeResponse extends ServerResponse {
  send(body: string | object): void;
}

type Middleware = (
  req: VivaeRequest,
  res: VivaeResponse,
  next: (err?: any) => void,
) => void;

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
