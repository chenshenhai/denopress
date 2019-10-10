import { fs } from "./../../deps.ts";
import { Template } from "./../template/mod.ts";
import { isType } from "./../util/is_type.ts";
import {
  TypeThemeConfig,
  TypeThemePageController,
  TypeThemePageScript,
  TypeTheme,
  TypeThemeLoader,
  TypeThemeLoaderOpts,
  TypeThemeListLoaderOpts,
  TypeThemeListLoader,
} from "./types.ts";

const { readJsonSync, readFileStrSync } = fs;


export class ThemeListLoader implements TypeThemeListLoader {

  private _opts: TypeThemeListLoaderOpts;
  private _loaderList: ThemeLoader[];
  private _loaderMap: Map<string, ThemeLoader> = new Map();
  
  constructor(opts: TypeThemeListLoaderOpts) {
    this._opts = opts;
    const loaderMap = new Map();
    this._loaderList = opts.themeList.map((themeName) => {
      const path = this._fullPath([themeName]);
      const loader: ThemeLoader = new ThemeLoader({ path, });
      loaderMap.set(themeName, loader);
      return loader;
    });
    this._loaderMap = loaderMap;
  }

  public async loadThemeMap(): Promise<Map<string, TypeTheme>> {
    const themeList = await this.loadThemeList();
    if (isType.error(themeList) === true) {
      return Promise.reject(themeList);
    };
    const map: Map<string, TypeTheme> = new Map();
    themeList.forEach((theme: TypeTheme) => {
      const name = theme.config.name;
      map.set(name, theme);
    });
    return Promise.resolve(map);
  }

  public async reloadThemePage(theme: string, page: string): Promise<TypeThemePageScript|undefined> {
    const loader: TypeThemeLoader|undefined = this._loaderMap.get(theme);
    if (loader) {
      const themePage = await loader.reloadThemePage(page);
      return Promise.resolve(themePage);
    } else {
      return Promise.resolve(undefined);
    }
  }

  public async loadThemeList(): Promise<TypeTheme[]> {
    const list: TypeTheme[] = [];
    // return new Promise((resolve, reject) => { });
    for await(const theme of this._asyncGenerator(this._loaderList) ) {
      list.push(theme);
    }
    return list;
  }

  private async * _asyncGenerator(loaderList: ThemeLoader[]) {
    for (let i = 0; i < loaderList.length; i++) {
      yield loaderList[i].loadTheme();
    }
  }

  private _fullPath(pathList: string[]): string {
    const path: string = this._opts.basePath;
    const fullPath: string = [ ...[path], ...pathList].join('/');
    return fullPath;
  }
}

export class ThemeLoader implements TypeThemeLoader {
  private _opts: TypeThemeLoaderOpts;
  private _config: TypeThemeConfig|null = null;

  constructor(opts: TypeThemeLoaderOpts) {
    this._opts = opts;
  }

  public async loadTheme(): Promise<TypeTheme> {
    const config: TypeThemeConfig = this._loadConfig();
    this._config = config;

    return new Promise((resolve, reject) => {
      this._loadPageScriptMap(config).then((pageScriptMap) => {
        resolve({
          config,
          pageScriptMap,
        })
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
    })
  }

  public async reloadThemePage(page: string): Promise<TypeThemePageScript> {
    return this._loadPageScript(page, {
      reload: true
    });
  }

  private _getThemeName(): string {
    let name: string = '';
    if (this._config) {
      name = this._config.name;
    }
    return name;
  }

  private async _loadPageScriptMap(config: TypeThemeConfig): Promise<Map<string, TypeThemePageScript>> {
    const map: Map<string, TypeThemePageScript> = new Map();
    const pages: string[] = config.pages;
    for await(const script of this._asyncGenerator(pages) ) {
      map.set(script.path, script);
    }
    return map;
  }

  private async * _asyncGenerator(pages: string[]) {
    for (let i = 0; i < pages.length; i++) {
      yield this._loadPageScript(pages[i]);
    }
  }

  private _loadPageScript(pageName: string, opts?: {
    reload?: boolean
  }): Promise<TypeThemePageScript> {
    const reload = opts && opts.reload === true;
    const themeName: string = this._getThemeName();
    
    const fullPathTpl: string = this._fullPath([pageName, 'page.html']);
    const fullPathCtrl: string = this._fullPath([pageName, 'page.ts'], {
      localFile: true,
      reload,
    });
    const logStatus = reload === true ? 'reload' : 'loading';
    return new Promise((resolve, reject) => {
      console.log(`[Denopress]: ${logStatus} ${themeName}/${pageName}/page.html`);
      const tplText: string = readFileStrSync(fullPathTpl, { encoding: "utf8" });
      const tpl: Template = new Template(tplText);
      const tplFunc: Function = tpl.compileToFunc();
      console.log(`[Denopress]: ${logStatus} ${themeName}/${pageName}/page.ts`);
      import(fullPathCtrl).then((mod) => {
        resolve({
          path: pageName,
          template: tplFunc,
          controller: mod.default as TypeThemePageController,
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  private _loadConfig(): TypeThemeConfig {
    const fullPath: string = this._fullPath(["theme.config.json"]);
    console.log(`[Denopress]: load theme.config ${fullPath}`);
    const config = readJsonSync(fullPath) as TypeThemeConfig;;
    return config;
  }

  private _fullPath(
    pathList: string[],
    opts?: { localFile?: boolean, reload?: boolean }): string {
      
    const path: string = this._opts.path;
    const fileBase: string[] = [];
    if (opts && opts.localFile === true) {
      fileBase.push('file:/');
    } 
    let fullPath: string = [...fileBase, ...[path], ...pathList].join('/');
    if (opts && opts.reload === true) {
      fullPath = `${fullPath}?_t=${Date.now()}`
    }
    return fullPath;
  }
  
}
