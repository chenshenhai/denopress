import {
  ThemeServer,
  TypeThemeServerOpts,
  TypeThemeServerContext,
} from "./mod.ts";

const addr = "127.0.0.1:5001";
const cwd = Deno.cwd();
const baseDir: string = [cwd, 'core/theme/assets', 'themes'].join("/");

const opts: TypeThemeServerOpts = {
  path: baseDir,
  themeList: [
    'theme_demo',
    'theme_script',
  ],
  controllerFrontAPI: {
    testFront: {
      getData: {
        method: 'GET',
        action(): Promise<object> {
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
      },
      postData: {
        method: 'POST',
        async action(ctx: TypeThemeServerContext): Promise<object> {
          const params = await ctx.getBodyParams();
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                type: 'front',
                body: params
              })
            }, 1000);
          });
        } 
      }
    }
  },
  controllerServerAPI: {
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