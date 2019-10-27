import {
  path,
  fs,
} from "./../../deps.ts";
import {
  TypeRemoteThemeLoaderOpts,
  TypeRemoteThemeLoader,
  TypeThemeConfig,
  TypeRemoteThemeLoaderTaskContext,
} from "./types.ts";
import { compose } from "./../util/compose.ts";
import { Logger } from "./../util/logger.ts";
import { isType } from "./../util/is_type.ts";
import { writeEnsureFileStrSync, writeEnsureJsonSync } from "./../util/file.ts";

const PAGE_PATH_REGEXP: RegExp = /pages\/[0-9a-zA-Z\_\-]{1,}$/;
const PAGE_LINK_REGEXP: RegExp = /pages\/[0-9a-zA-Z\_\-]{1,}\/page\.(ts|html)$/;
const CONFIG_BASENAME: string = "denopress.theme.json";

const logger = new Logger({
  prefix: 'denopress:remoteLoader',
});

function taskLogger(ctx: TypeRemoteThemeLoaderTaskContext, info: string) {
  logger.info(`[${ctx.index}/${ctx.count}] ${info}`);
}

export class RemoteThemeLoader implements TypeRemoteThemeLoader {

  private _opts: TypeRemoteThemeLoaderOpts;
  
  constructor(opts: TypeRemoteThemeLoaderOpts) {
    this._opts = opts;
  }
  
  async loadRemoteTheme(config: TypeThemeConfig): Promise<void> {

    logger.log(`loading theme@${config.name} ...`);
    const taskList: Function[] = [];
    const ctx: TypeRemoteThemeLoaderTaskContext = {
      index: 0,
      count: 0,
      remoteFileLinkList: [],
    }
    taskList.push(this._loadRemoteThemeConfig(config));
    taskList.push(this._loadRemoteFileLinks(config.name));
    
    ctx.count = taskList.length;
    return compose(taskList)(ctx);
  }

  private _loadRemoteThemeConfig(config: TypeThemeConfig): Function {
    const baseDir: string = this._opts.baseDir;
    const themeBaseDir: string = path.dirname(config.configLink);

    return async(ctx: TypeRemoteThemeLoaderTaskContext, next: Function) => {
      ctx.index ++;
      taskLogger(ctx, `loading remote theme@${config.name} config ...`);
      const fullPath = path.join(baseDir, config.name);
      if (fs.existsSync(fullPath)) {
        taskLogger(ctx, `theme@${config.name}\'s dir is existed`);
      } else {
        const res = await fetch(config.configLink);
        const json = await res.json();
        const configBasename = path.basename(config.configLink);
        if (CONFIG_BASENAME !== configBasename) {
          throw new Error(`basename is illegal: ${config.configLink}`)
        }
        const configFullPath: string = path.join(fullPath, configBasename);
        taskLogger(ctx, `writing remote theme@${config.name} config ...`);
        if (json && isType.array(json.pages)) {
          json.pages.forEach((page: string) => {
            if (isType.string(page) && PAGE_PATH_REGEXP.test(`${page}`)) {
              const pageTplLink = path.join(themeBaseDir, page, "page.html");
              const pageCtrlLink = path.join(themeBaseDir, page, "page.ts");
              ctx.remoteFileLinkList.push(pageTplLink);
              ctx.remoteFileLinkList.push(pageCtrlLink);
            }
          });
        }

        writeEnsureJsonSync(configFullPath, json, {
          spaces: 2,
        });
        await next();
      }
    }
  }

  // private _makeRootThemesDir(): Function {
  //   return async  (ctx: TypeRemoteThemeLoaderTaskContext, next: Function) => {
  //     ctx.index ++;
  //     taskLogger(ctx, 'making themes root dir ...');
  //     const baseDir: string = this._opts.baseDir;
  //     const fullPath = path.join(baseDir);
  //     const status = fs.existsSync(fullPath);
  //     if (!status) {
  //       Deno.mkdirSync(fullPath); 
  //     }
  //     await next();
  //   }
  // }

  private _loadRemoteFileLinks(themeName: string): Function {
    
    // const baseDir: string = this._opts.baseDir;
    return async (ctx: TypeRemoteThemeLoaderTaskContext, next: Function) => {
      // const res = await fetch(link);
      // const text = await res.text();
      // console.log(ctx.remoteFileLinkList);
      ctx.index ++;
      taskLogger(ctx, `loading theme files ...`);
      for await (let func of this._generatorFileListLoadFunc(ctx, themeName)) {
        // Nothing
      }
      await next();
    }
  }

  private async * _generatorFileListLoadFunc(ctx: TypeRemoteThemeLoaderTaskContext, themeName: string) {

    const links: string[] = ctx.remoteFileLinkList;
    const baseDir: string = this._opts.baseDir;
    const asyncFuncMap: Map<string, Function> = new Map();
    
    links.forEach((link: string) => {
      const endPath = this._getFileEndPath(link);
      const fullPath = path.join(baseDir, themeName, endPath);
      const func = async (): Promise<void> => {
        taskLogger(ctx, `loading ${themeName}@${endPath} ...`);
        const res = await fetch(link);
        const text: string = await res.text();
        writeEnsureFileStrSync(fullPath, text);
      }
      asyncFuncMap.set(endPath, func);
    });

    for (let [key, func] of asyncFuncMap) {
      yield func();
    }
  }

  private _getFileEndPath(link: string): string {
    let endPath: string = '';
    if (PAGE_LINK_REGEXP.test(link)) {
      const rs = link.match(PAGE_LINK_REGEXP);
      if (rs && rs[0] && isType.string(rs[0])) {
        endPath = rs[0];
      }
    }
    return endPath;
  }


}