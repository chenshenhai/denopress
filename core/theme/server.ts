import { cookie } from "./../../deps.ts";
import {
  Application,
  Router,
  Context,
  staticServe,
  bodyTextParser,
  getBodyTextParserKey
} from "./../web/mod.ts";
import { ThemeLoaderHub } from "./loader_hub.ts";
import {
  TypeReadPageResult,
  TypeThemeServerOpts,
  TypeThemeServerContext,
  TypeThemeFrontAPI,
  TypeThemeControllerFrontAPI,
  TypeThemePageControllerOnLoadContext,
  TypeThemePageControllerOnLoadApp,
} from "./types.ts"


export class PageContext implements TypeThemePageControllerOnLoadContext {
  private _ctx: Context;
  
  constructor(ctx: Context) {
    this._ctx = ctx;
  }

  async getUrlParams(): Promise<{[key: string]: string}> {
    const params = await this._ctx.req.getAllURLParams();
    return params;
  }

  async getCookies(): Promise<{[key: string]: string}> {
    const cookies = await this._ctx.req.getCookies();
    return cookies;
  }
  
  redirect(url: string) {
    this._ctx.res.redirect(url);
  }
}


export class ThemeServerContext implements TypeThemeServerContext {
  private _ctx: Context;
  constructor(ctx: Context) {
    this._ctx = ctx;
  }

  getUrlParams(): {[key: string]: string} {
    const ctx = this._ctx;
    const urlParams: {[key: string]: string} = ctx.req.getAllURLParams() as {[key: string]: string};
    return urlParams;
  }

  async getBodyParams(): Promise<{[key: string]: string}> {
    const ctx = this._ctx;
    const funcKey = getBodyTextParserKey();
    const parserTextFunc = ctx.getFunc(funcKey);
    let bodyParams: {[key: string]: string} = {};
    if (typeof parserTextFunc === "function") {
      bodyParams = await parserTextFunc();
    }
    return bodyParams;
  }

  getCookies(): cookie.Cookies {
    return this._ctx.req.getCookies();
  }
  setCookie(cookie: cookie.Cookie): void {
    this._ctx.res.setCookie(cookie);
  }
  deleteCookie(name: string): void {
    this._ctx.res.deleteCookie(name);
  }

  redirect(url: string) {
    this._ctx.res.redirect(url);
  }

}

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
    const routerDataKey = router.getContextDataKey();

    this._app.use(bodyTextParser);
    
    this._app.use(staticServe(`${path}/$0/static/`, {
      prefix: '^/static/([a-zA-Z\-\_]{1,})/',
      regular: true,
    }))
    
    router.get("/page/:themeName/:pageName", async (ctx: Context) =>{
      const params: {[key: string]: string} = ctx.getData(routerDataKey) as {[key: string]: string};
      const pageName: string = params.pageName as string;
      const themeName: string = params.themeName;
      const page: TypeReadPageResult = await this._readPageContent(ctx, themeName, pageName);
      ctx.res.setStatus(page.status);
      ctx.res.setBody(page.content);
    });

    // front api config
    if (this._opts.controllerFrontAPI) {
      
      router.get("/api/:service/:api", async (ctx: Context) => {
        const params: {[key: string]: string} = ctx.getData(router.getContextDataKey()) as {[key: string]: string};
        const api: TypeReadPageResult = await this._getControllerAPIContent(ctx, params.service, params.api);
        ctx.res.setStatus(api.status);
        ctx.res.setBody(api.content);
      });

      router.post("/api/:service/:api", async (ctx: Context) => {
        const params: {[key: string]: string} = ctx.getData(router.getContextDataKey()) as {[key: string]: string};
        const api: TypeReadPageResult = await this._getControllerAPIContent(ctx, params.service, params.api);
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

  private async _readPageContent(ctx: Context, themeName: string, pageName: string): Promise<TypeReadPageResult> {

    const result = {
      status: 404,
      content: `404: page/${themeName}/${pageName} Not Found!`,
    }
    const pageKey = `pages/${pageName || ''}`;
    const loaderHub = this._loaderHub;
    const pctx = new PageContext(ctx);
    const api = this._opts.controllerServerAPI || undefined

    if (this._opts.hotLoading !== true) {
      if (loaderHub.hasTheme(themeName)) {
        const pageScript = loaderHub.getThemePage(themeName, pageKey);
        if (loaderHub.hasThemePage(themeName, pageKey) && pageScript) {
          let pageOnLoad: boolean = true;
          if (typeof pageScript.controller.onLoad === "function") {
            pageOnLoad = await pageScript.controller.onLoad(pctx, api);
          }
          if (pageOnLoad !== false) {
            const pageData = await pageScript.controller.data(pctx, api);
            const pageContent = pageScript.template(pageData);
            result.status = 200;
            result.content = pageContent;
          }
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
          let pageOnLoad: boolean = true;
          if (typeof pageScript.controller.onLoad === "function") {
            pageOnLoad = await pageScript.controller.onLoad(pctx, api);
          }
          if (pageOnLoad !== false) {
            const pageData = await pageScript.controller.data(pctx, api);
            const pageContent = pageScript.template(pageData);
            result.status = 200;
            result.content = pageContent;
          }
        }
      } else {
        result.status = 404;
        result.content = `404: theme/${themeName} is not found!`;
      }
    }

    return result;
  }

  private async _getControllerAPIContent(ctx: Context, ctrlName: string, apiName: string): Promise<TypeReadPageResult> {
    // const path: string = this._opts.path;
    const method = ctx.req.getMethod();
    const result = {
      status: 404,
      content: `404: [${method}] api/${ctrlName}/${apiName} is not found!`,
    }
    
    const ctrlFrontAPI: TypeThemeControllerFrontAPI|undefined = this._opts.controllerFrontAPI;
    
    if (ctrlFrontAPI) {
      const frontApi: TypeThemeFrontAPI = ctrlFrontAPI[ctrlName];
      if (frontApi) {
        const ctrl = frontApi[apiName];
        if (ctrl) {
          const api = ctrl.action;
          if (typeof api === 'function' && ctrl.method === method) {
            const sctx = new ThemeServerContext(ctx)
            const apiContent = await api(sctx);
            result.status = 200;
            result.content = JSON.stringify(apiContent);
          }
        }
      } else {
        result.status = 404;
        result.content = `404: api/${ctrlName} is not found!`;
      }
    }
  
    return result;
  }

}
