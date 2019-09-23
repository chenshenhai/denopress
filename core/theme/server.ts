import {
  Application,
  Router,
  Context,
  staticServe,
} from "./../web/mod.ts";

export interface ThemeServerOptsType {
  path: string;
  // inject: ThemeServiceType;
}

interface ReadPageResultType {
  status: number;
  content: string;
}

export class ThemeServer {
  private _addr: string;
  private _opts: ThemeServerOptsType;
  private _app: Application;

  constructor(addr: string, opts: ThemeServerOptsType) {
    this._addr = addr;
    this._opts = opts;
    this._app = new Application();
    const router = new Router();

    const path: string = this._opts.path;
    const themeName: string = path.split('/').pop();
    
    this._app.use(staticServe(`${path}/static/`, {prefix: `/static/${themeName}`}))
    
    router.get("/page/:pageName", async (ctx) =>{
      const params = ctx.getData("router");
      const pageName: string = params.pageName;
      const page: ReadPageResultType = this._readPageFileText(pageName);
      ctx.res.setStatus(page.status);
      ctx.res.setBody(page.content);
    });
    this._app.use(router.routes());
  }

  async start(): Promise<void> {
    const addr: string = this._addr;
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

  private _readPageFileText(pageName): ReadPageResultType{
    const path: string = this._opts.path;
    const result = {
      status: 404,
      content: `404: page/${pageName} Not Found!`,
    }
    const fullPath: string = [path, 'page', pageName, 'page.html'].join('/');

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
