import {
  Application,
  Router,
  Context,
  staticServe,
} from "./../web/mod.ts";
import { ThemeListLoader } from "./loader.ts";
import {
  TypeTheme,
  TypeReadPageResult,
  TypeThemeServerOpts,
  TypeThemePageScript,
} from "./types.ts"


export class ThemeServer {
  private _addr: string;
  private _opts: TypeThemeServerOpts;
  private _app: Application;
  private _loader: ThemeListLoader;
  private _themeMap: Map<string, TypeTheme> = new Map();

  constructor(addr: string, opts: TypeThemeServerOpts) {
    this._addr = addr;
    this._opts = opts;
    this._app = new Application();
    const router = new Router();

    const path: string = this._opts.path;
    const themeName: string = path.split('/').pop();
    
    this._app.use(staticServe(`${path}/$0/static/`, {
      prefix: '^/static/([a-zA-Z\-\_]{1,})/',
      regular: true,
    }))
    
    router.get("/page/:themeName/:pageName", async (ctx) =>{
      const params = ctx.getData("router");
      const pageName: string = params.pageName;
      const themeName: string = params.themeName;
      const page: TypeReadPageResult = await this._readPageContent(themeName, pageName);
      ctx.res.setStatus(page.status);
      ctx.res.setBody(page.content);
    });
    this._app.use(router.routes());

    let themeNameList: string[] = [];
    if (this._opts.themeList) {
      themeNameList = this._opts.themeList;
    }
    const loader = new ThemeListLoader({
      basePath: [this._opts.path].join('/'),
      themeList: themeNameList,
    });
    this._loader = loader;
  }

  async start(): Promise<void> {
    const addr: string = this._addr;
    return new Promise((resolve, reject) => {
      this._loader.loadThemeMap().then((themeMap) => {
        this._themeMap = themeMap;
        this._app.listen(addr, () => {
          resolve();
        })
      }).catch((err) => {
        reject(err);
      });
    })
  }

  private async _readPageContent(themeName: string, pageName: string): Promise<TypeReadPageResult> {
    const path: string = this._opts.path;
    const result = {
      status: 404,
      content: `404: page/${themeName}/${pageName} Not Found!`,
    }
    
    const themeMap: Map<string, TypeTheme> = this._themeMap;
    const theme: TypeTheme = themeMap.get(themeName);

    if (theme) {
      const pageMap: Map<string, TypeThemePageScript> = theme.pageScriptMap;
      const scriptMap = pageMap.get(`pages/${pageName || ''}`);
      
      if (scriptMap) {
        const pageData = await scriptMap.controller.data();
        const pageContent = scriptMap.template(pageData);
        result.status = 200;
        result.content = pageContent;
      }
    } else {
      result.status = 404;
      result.content = `404: theme/${themeName} Not Found!`;
    }
    return result;
  }

}
