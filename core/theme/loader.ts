import { fs } from "./../../deps.ts";
import { Template } from "./../template/mod.ts";

const { readJsonSync, readFileStrSync } = fs;

export interface TypeThemeConfig {
  name: string;
  version: string;
  pages: string[];
}

export interface TypeThemePageController {
  data(): {
    [key: string]: any;
  };
}

export interface TypeThemePageScript {
  path: string;
  template: Function;
  controller: TypeThemePageController;
}

export interface TypeTheme {
  config: TypeThemeConfig;
  pageScriptMap: Map<string, TypeThemePageScript>;
}

interface TypeThemeLoader {
  loadTheme(): Promise<TypeTheme>;
}


export interface TypeThemeLoaderOpts {
  path: string;
}

export class ThemeLoader implements TypeThemeLoader {
  private _opts: TypeThemeLoaderOpts;
  // private _config: TypeThemeConfig;

  constructor(opts: TypeThemeLoaderOpts) {
    this._opts = opts;
  }

  public async loadTheme(): Promise<TypeTheme> {
    const config: TypeThemeConfig = this._loadConfig();
    const pageScriptMap: Map<string, TypeThemePageScript> = await this._loadPageScriptMap(config);
    return Promise.resolve({
      config,
      pageScriptMap,
    })
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

  private _loadPageScript(pageName: string): Promise<TypeThemePageScript> {
    const fullPathTpl: string = this._fullPath([pageName, 'page.html']);
    const fullPathCtrl: string = this._fullPath([pageName, 'page.ts']);
    return new Promise((resolve, reject) => {
      console.log(`[Denopress]: load theme ${fullPathTpl}`);
      const tplText: string = readFileStrSync(fullPathTpl, { encoding: "utf8" });
      const tpl: Template = new Template(tplText);
      const tplFunc: Function = tpl.compileToFunc();
      console.log(`[Denopress]: load theme ${fullPathCtrl}`);
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
    console.log(`[Denopress]: load theme ${fullPath}`);
    const config = readJsonSync(fullPath) as TypeThemeConfig;;
    return config;
  }

  private _fullPath(pathList: string[]): string {
    const path: string = this._opts.path;
    const fullPath: string = [ ...[path], ...pathList].join('/');
    return fullPath;
  }
  
}
