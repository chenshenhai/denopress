import { ThemeServer } from "./../core/theme/mod.ts";
import { TypeDenopressConfig } from "./../core/types.ts";
import serviceTodoList from "./service/todo_list.ts"; 
import { createPortalServiceFrontMap } from "./service/mod.ts";


export function createPortalServer(config: TypeDenopressConfig, opts: { baseDir: string }) {
  const portalServer = new ThemeServer(`127.0.0.1:${config.portalServer.port}`, {
    path: opts.baseDir,
    themeList: config.portalThemes.map((item) => {
      return item.name;
    }),
    serviceFrontAPI: createPortalServiceFrontMap(config),
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
      todoList: {
        getData: {
          method: 'GET',
          action: serviceTodoList.getData,
        }
      },
    },
    serviceServerAPI: {
      todoList: serviceTodoList,
    },
  });
  return adminServer;
}
