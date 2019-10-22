import { fs } from "./../deps.ts";
import { ThemeServer } from "./../core/theme/mod.ts";
import { TypeThemeConfig } from "./../core/theme/types.ts";
import { backPath } from "./util/path.ts";

// const { ThemeServer } = Theme;
const { readJsonSync } = fs;

const addr = "127.0.0.1:8002";
const baseDir: string = [Deno.cwd()].join("/");
const prevDir: string = backPath(baseDir);
const configPath: string = [baseDir, 'theme.config.json'].join("/");

const config: TypeThemeConfig = readJsonSync(configPath) as TypeThemeConfig;

const server = new ThemeServer(addr, {
  path: prevDir,
  themeList: [
    config.name ,
  ],
  hotLoading: true,
  // themeServiceAPI: {
  //   todoList: serviceTodoList,
  // }
})

async function main() {
  await server.start();
  console.log('------- dev.portal ------');
}

main();