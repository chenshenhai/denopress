import { ThemeServer } from "./../core/theme/mod.ts";
import { TypeDenopressConfig } from "./../core/types.ts";
import serviceTodoList from "./services/todo_list.ts"; 

// const addr = "127.0.0.1:8001";
// const baseDir: string = [Deno.cwd(), 'example/themes_portal'].join("/");


export function createPortalServer(config: TypeDenopressConfig, opts: { baseDir: string }) {
  const portalServer = new ThemeServer(`127.0.0.1:${config.portalServer.port}`, {
    path: opts.baseDir,
    themeList: config.portalThemes.map((item) => {
      return item.name;
    }),
    serviceFrontAPI: {
      todoList: serviceTodoList,
    },
    serviceServerAPI: {
      todoList: serviceTodoList,
    },
  });
  return portalServer;
}
