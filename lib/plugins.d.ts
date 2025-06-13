import type { VivaeServer, Middleware, Method } from "./index";

export interface Plugin {
  plugin: true;
  init(server: VivaeServer): Route;
}

export interface Route {
  path?: string;
  method?: Method;
  middleware: Middleware;
}

type PluginFunction<Args extends any[]> = (
  ...args: Args
) => (server: VivaeServer) => Route;

export function createPlugin<Args extends any[]>(
  fn: PluginFunction<Args>,
): (...args: Args) => Plugin;

export function serve(
  directory: string,
  options?: {
    autoEncoding?: boolean;
    headers?: {
      [fileExtension: string]: {
        [header: string]: string;
      };
    };
  },
): Plugin;
