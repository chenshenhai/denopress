import { ThemeServer } from "./../core/theme/mod.ts";
import { TypeDenopressConfig } from "./../core/types.ts";
import serviceTodoList from "./services/todo_list.ts"; 
import { createPortalServiceMap } from "./services/mod.ts";


export function createPortalServer(config: TypeDenopressConfig, opts: { baseDir: string }) {
  const portalServer = new ThemeServer(`127.0.0.1:${config.portalServer.port}`, {
    path: opts.baseDir,
    themeList: config.portalThemes.map((item) => {
      return item.name;
    }),
    serviceFrontAPI: createPortalServiceMap(config),
    serviceServerAPI: {
      todoList: serviceTodoList,
    },
  });
  return portalServer;
}


export function createAdminServer(config: TypeDenopressConfig, opts: { baseDir: string }) {
  const adminServer = new ThemeServer(`127.0.0.1:${config.adminServer.port}`, {
    path: opts.baseDir,
    themeList: config.adminThemes.map((item) => {
      return item.name;
    }),
    serviceFrontAPI: {
      todoList: serviceTodoList,
    },
    serviceServerAPI: {
      todoList: serviceTodoList,
    },
  });
  return adminServer;
}
