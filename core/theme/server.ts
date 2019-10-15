import {
  Application,
  Router,
  Context,
  staticServe,
} from "./../web/mod.ts";
import { ThemeLoaderHub } from "./loader_hub.ts";
import {
  TypeTheme,
  TypeReadPageResult,
  TypeThemeServerOpts,
  TypeThemePageScript,
  TypeThemeAPI,
  TypeThemeServiceAPI,
} from "./types.ts"


export class ThemeServer {
  private _addr: string;
  private _opts: TypeThemeServerOpts;
  private _app: Application;
  private _loaderHub: ThemeLoaderHub;

  constructor(addr: string, opts: TypeThemeServerOpts) {
    this._addr = addr;
    this._opts = opts;
    this._app = new Application();
    const router = new Router();

    const path: string = this._opts.path;
    // const themeName: string = path.split('/').pop();
    
    this._app.use(staticServe(`${path}/$0/static/`, {
      prefix: '^/static/([a-zA-Z\-\_]{1,})/',
      regular: true,
    }))
    
    router.get("/page/:themeName/:pageName", async (ctx: Context) =>{
      const params: {[key: string]: string} = ctx.getData("router") as {[key: string]: string};
      const pageName: string = params.pageName as string;
      const themeName: string = params.themeName;
      const page: TypeReadPageResult = await this._readPageContent(themeName, pageName);
      ctx.res.setStatus(page.status);
      ctx.res.setBody(page.content);
    });
    if (this._opts.themeServiceAPI) {
      router.get("/api/:service/:api", async (ctx: Context) => {
        const params: {[key: string]: string} = ctx.getData("router") as {[key: string]: string};
        const urlParams: {[key: string]: string} = ctx.req.getAllURLParams() as {[key: string]: string};
        const api: TypeReadPageResult = await this._getServiceAPIContent(urlParams, params.service, params.api);
        ctx.res.setStatus(api.status);
        ctx.res.setBody(api.content);
      });
    }


    this._app.use(router.routes());

    let themeNameList: string[] = [];
    if (this._opts.themeList) {
      themeNameList = this._opts.themeList;
    }
    const loaderHub = new ThemeLoaderHub({
      basePath: [this._opts.path].join('/'),
      themeList: themeNameList,
    });
    this._loaderHub = loaderHub;
  }

  async start(): Promise<void> {
    const addr: string = this._addr;
    return new Promise((resolve, reject) => {
      this._loaderHub.resetAllThemes().then(() => {
        this._app.listen(addr, () => {
          resolve();
        })
      }).catch((err) => {
        reject(err);
      });
    })
  }

  private async _readPageContent(themeName: string, pageName: string): Promise<TypeReadPageResult> {

    const result = {
      status: 404,
      content: `404: page/${themeName}/${pageName} Not Found!`,
    }
    const pageKey = `pages/${pageName || ''}`;
    const loaderHub = this._loaderHub;
    
    if (this._opts.hotLoading !== true) {
      if (loaderHub.hasTheme(themeName)) {
        const pageScript = loaderHub.getThemePage(themeName, pageKey);
        if (loaderHub.hasThemePage(themeName, pageKey) && pageScript) {
          const pageData = await pageScript.controller.data();
          const pageContent = pageScript.template(pageData);
          result.status = 200;
          result.content = pageContent;
        }
      } else {
        result.status = 404;
        result.content = `404: theme/${themeName} is not found!`;
      }
    } else {
      if (loaderHub.existTheme(themeName) !== true) {
        loaderHub.addTheme(themeName);
      }
      if (loaderHub.existTheme(themeName)) {
        const pageScript = await loaderHub.reloadThemePage(themeName, pageKey);
        if (loaderHub.existThemePage(themeName, pageKey) && pageScript) {
          const pageData = await pageScript.controller.data();
          const pageContent = pageScript.template(pageData);
          result.status = 200;
          result.content = pageContent;
        }
      } else {
        result.status = 404;
        result.content = `404: theme/${themeName} is not found!`;
      }
    }

    return result;
  }

  private async _getServiceAPIContent(params: object, serviceName: string, apiName: string): Promise<TypeReadPageResult> {
    // const path: string = this._opts.path;
    const result = {
      status: 404,
      content: `404: api/${serviceName}/${apiName} is not found!`,
    }
    
    const themeServiceAPI: TypeThemeServiceAPI|undefined = this._opts.themeServiceAPI;
    
    if (themeServiceAPI) {
      const service = themeServiceAPI[serviceName];
      if (service) {
        const api = service[apiName];
        if (typeof api === 'function') {
          const apiContent = await api(params);
          result.status = 200;
          result.content = JSON.stringify(apiContent);
        }
      } else {
        result.status = 404;
        result.content = `404: api/${serviceName} is not found!`;
      }
    }
  
    return result;
  }

}
