import { IncomingMessage, ServerResponse } from "http";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

interface VivaeRequest extends IncomingMessage {
  path?: string;
  [key: string]: any;
}

interface VivaeResponse extends ServerResponse {
  setHeaders(headers: Record<string, string>): void;
  send(body: string): void;
}

type Middleware = (
  req: VivaeRequest,
  res: VivaeResponse,
  next: (err?: any) => void,
) => void;

type Handler = (req: VivaeRequest, res: VivaeResponse) => void;

interface VivaeConfig {
  debug?: {
    logging?: boolean;
  };
  allowQueries?: boolean;
}

interface VivaeServer {
  config?: VivaeConfig;

  use(middleware: Middleware): void;

  add(path: string, method: Method, handler: Handler): void;
  add(path: string, handler: Handler): void;

  listen(port: number, callback?: () => void): void;
}

declare function vivae(): VivaeServer;

export = vivae;
