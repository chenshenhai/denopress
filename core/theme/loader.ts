import { fs } from "./../../deps.ts";
import { Template } from "./../template/mod.ts";
import { isType } from "./../util/is_type.ts";
import {
  TypeThemePressConfig,
  TypeThemePageController,
  TypeThemePageScript,
  TypeTheme,
  TypeThemeLoader,
  TypeThemeLoaderOpts,
} from "./types.ts";

const { readJsonSync, readFileStrSync, existsSync } = fs;

export class ThemeLoader implements TypeThemeLoader {
  private _opts: TypeThemeLoaderOpts;
  private _config: TypeThemePressConfig|undefined = undefined;
  private _pageScriptMap: Map<string, TypeThemePageScript>|null = new Map();

  constructor(opts: TypeThemeLoaderOpts) {
    this._opts = opts;
  }

  public async reset(): Promise<TypeThemePressConfig> {
    const theme: TypeTheme = await this.reloadTheme();
    this._config = theme.config;
    this._pageScriptMap = theme.pageScriptMap;
    return theme.config;
  }

  /**
   * Test whether or not theme exist
   * @param {string} theme 
   * @return {boolean}
   */
  public exist(): boolean {
    const isDirExist: boolean = existsSync(this._opts.path);
    return isDirExist;
  }


  /**
   * Test whether or not the template and script of page exist
   * @param {string} theme 
   * @param {string} page 
   * @return {boolean}
   */
  public existPage(page: string): boolean {
    const isThemeExist = this.exist();
    let result: boolean = false;
    if (isThemeExist) {
      const tplFullPath = this._fullPath([page, 'page.html']);
      const isTplExist = existsSync(tplFullPath);

      const scriptFullPath = this._fullPath([page, 'page.ts']);
      const isScriptExist = existsSync(scriptFullPath);

      result = isTplExist && isScriptExist;
    }
    return result;
  }

  public reloadConfig(): TypeThemePressConfig {
    const fullPath: string = this._fullPath(["denopress.theme.json"]);
    // console.log('fullPath = ', fullPath);
    const config = readJsonSync(fullPath) as TypeThemePressConfig;;
    return config;
  }

  public hasConfig(): boolean {
    return !!this._config;
  }

  public hasPage(page: string): boolean {
    let result: boolean = false;
    if (this._pageScriptMap) {
      if (this._pageScriptMap.get(page)) {
        result = true;
      }
    }
    return result;
  }

  public getPage(page: string): TypeThemePageScript|undefined {
    let result: TypeThemePageScript|undefined = undefined;
    if (this._pageScriptMap) {
      result = this._pageScriptMap.get(page);
    }
    return result;
  }

  public getConfig(): TypeThemePressConfig|undefined {
    return this._config;
  }


  public async reloadTheme(): Promise<TypeTheme> {
    const config: TypeThemePressConfig = this.reloadConfig();
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

  private async _loadPageScriptMap(config: TypeThemePressConfig): Promise<Map<string, TypeThemePageScript>> {
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
