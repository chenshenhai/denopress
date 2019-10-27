import { fs } from "./../../deps.ts";
import { Template } from "./../template/mod.ts";
import { isType } from "./../util/is_type.ts";
import { ThemeLoader } from "./loader.ts";

import {
  TypeThemePressConfig,
  TypeThemePageController,
  TypeThemePageScript,
  TypeTheme,
  TypeThemeLoader,
  TypeThemeLoaderOpts,
  TypeThemeLoaderHubOpts,
  TypeThemeLoaderHub,
} from "./types.ts";

const { readJsonSync, readFileStrSync, existsSync } = fs;


export class ThemeLoaderHub implements TypeThemeLoaderHub {

  private _opts: TypeThemeLoaderHubOpts;
  private _loaderMap: Map<string, ThemeLoader> = new Map();
  private _themeMap: Map<string, TypeTheme> = new Map();
  private _configMap: Map<string, TypeThemePressConfig> = new Map();
  
  constructor(opts: TypeThemeLoaderHubOpts) {
    this._opts = opts;
    const loaderMap = new Map();
    opts.themeList.map((themeName) => {
      const path = this._fullPath([themeName]);
      const loader: ThemeLoader = new ThemeLoader({ path, });
      loaderMap.set(themeName, loader);
      return loader;
    });
    this._loaderMap = loaderMap;
  }

  public async resetAllThemes(): Promise<void> {
    try {
      for await (const config of this._resetAllLoaderMapAsync()) {
        console.log(`[Denopress]: theme ${config.name} has loaded!`);
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
    return Promise.resolve();
  }

  public existTheme(theme: string): boolean {
    let result: boolean = false;
    const loader: ThemeLoader|undefined = this._loaderMap.get(theme);
    if (loader instanceof ThemeLoader) {
      result = loader.exist();
    }
    return result;
  }

  public existThemePage(theme: string, page: string): boolean {
    let result: boolean = false;
    const loader: ThemeLoader|undefined = this._loaderMap.get(theme);
    if (loader instanceof ThemeLoader) {
      result = loader.existPage(page);
    }
    return result;
  }

  
  public hasTheme(theme: string): boolean {
    const loader: ThemeLoader|undefined = this._loaderMap.get(theme);
    return loader instanceof ThemeLoader;
  }


  public hasThemePage(theme: string, page: string): boolean {
    let result: boolean = false;
    const loader: ThemeLoader|undefined = this._loaderMap.get(theme);
    if (loader instanceof ThemeLoader) {
      result = loader.hasPage(page);
    }
    return result;
  }

  public getThemePage(theme: string, page: string): TypeThemePageScript|undefined {
    let result: TypeThemePageScript|undefined = undefined;
    const loader: ThemeLoader|undefined = this._loaderMap.get(theme);
    if (loader instanceof ThemeLoader) {
      result = loader.getPage(page);
    }
    return result;
  }

  public addTheme(theme: string): void {
    if (this.hasTheme(theme) !== true) {
      if (this.existTheme(theme)) {
        const fullPath = this._fullPath([theme]);
        const loader = new ThemeLoader({ path: fullPath });
        this._loaderMap.set(theme, loader);
        this._opts.themeList.push(theme);
      }
    }
  }


  public async reloadThemePage(theme: string, page: string): Promise<TypeThemePageScript|undefined> {
    return new Promise((resolve, reject) => {
      try {
        const pageScript: TypeThemePageScript|undefined = undefined;
        const loader: ThemeLoader|undefined = this._loaderMap.get(theme);
        if (loader instanceof ThemeLoader) {
          if (loader.existPage(page)) {
            loader.reloadThemePage(page).then((script) => {
              resolve(script);
            }).catch((err) => {
              console.log(err);
              reject(err);
            });
          } else {
            resolve(pageScript);
          }
        } else {
          resolve(pageScript);
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  private async * _resetAllLoaderMapAsync() {
    for (let [key, loader] of this._loaderMap.entries()) {
      yield loader.reset();
    }
  }

  private _fullPath(pathList: string[]): string {
    const path: string = this._opts.basePath;
    const fullPath: string = [ ...[path], ...pathList].join('/');
    return fullPath;
  }
}

