import { ThemeServer, TypeThemeServerOpts } from "./mod.ts";

const addr = "127.0.0.1:5001";
const cwd = Deno.cwd();
const baseDir: string = [cwd, 'assets', 'themes'].join("/");

const opts: TypeThemeServerOpts = {
  path: baseDir,
  themeList: [
    'theme_demo',
    'theme_script',
  ],
  serviceFrontAPI: {
    testFront: {
      getData(): Promise<object> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              type: 'front',
              todolist: [
                0,1,2,3,4,5,6,7,8,9
              ]
            })
          }, 1000);
        });
      } 
    }
  },
  serviceServerAPI: {
    testServer: {
      getData(): Promise<object> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              type: 'server',
              todolist: [
                0,1,2,3,4,5,6,7,8,9
              ]
            })
          }, 1000);
        });
      } 
    }
  },
  hotLoading: true,
}
const server = new ThemeServer(addr, opts)

async function main() {
  const result = await server.start();
  console.log('start theme server !', result)
}

main();