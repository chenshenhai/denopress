import {
  Application,
  Router,
  Context,
  staticServe,
} from "./../web/mod.ts";
import { ThemeLoader } from "./loader.ts";
import { TypeReadPageResult, TypeThemeServerOpts } from "./types.ts"


export class ThemeServer {
  private _addr: string;
  private _opts: TypeThemeServerOpts;
  private _app: Application;
  private _loader: ThemeLoader|null = null;

  constructor(addr: string, opts: TypeThemeServerOpts) {
    this._addr = addr;
    this._opts = opts;
    this._app = new Application();
    const router = new Router();

    const path: string = this._opts.path;
    const themeName: string = path.split('/').pop();
    
    this._app.use(staticServe(`${path}/static/`, {prefix: `/static/${themeName}`}))
    
    router.get("/page/:themeName/:pageName", async (ctx) =>{
      const params = ctx.getData("router");
      const pageName: string = params.pageName;
      const themeName: string = params.themeName;
      const page: TypeReadPageResult = this._readPageFileText(themeName, pageName);
      ctx.res.setStatus(page.status);
      ctx.res.setBody(page.content);
    });
    this._app.use(router.routes());
  }

  async start(): Promise<void> {
    const addr: string = this._addr;
    // let themeList: string[] = [];
    // if (this._opts.themeList) {
    //   themeList = this._opts.themeList;
    // }
    // const loader = new ThemeLoader({
    //   path: [this._opts.path, 'themes'].join('/'),
    //   themeList,
    // });
    // const themeMap = await loader.loadTheme();
    return new Promise((resolve, reject) => {
      try {
        this._app.listen(addr, () => {
          resolve();
        })
      } catch (err) {
        reject(err);
      }
    })
  }

  private _readPageFileText(themeName: string, pageName: string): TypeReadPageResult{
    const path: string = this._opts.path;
    const result = {
      status: 404,
      content: `404: page/${pageName} Not Found!`,
    }
    const fullPath: string = [path, themeName, 'pages', pageName, 'page.html'].join('/');

    try {
      const stat = Deno.lstatSync(fullPath);
      const decoder = new TextDecoder();
      if (stat.isFile() === true) {
        const bytes = Deno.readFileSync(fullPath);
        const content = decoder.decode(bytes);
        result.content = content;
        result.status = 200;
      }
    } catch (err) {
      // TODO;
    }
    return result;
  }

}
