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

const logger = new Logger({
  prefix: 'denopress remote loader',
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
    // TODO
    // console.log('config =', config);

    logger.log('loadRemoteTheme ...');
    const taskList: Function[] = [];
    const ctx: TypeRemoteThemeLoaderTaskContext = {
      index: 0,
      count: 0,
      remoteFileLinkList: [],
    }
    taskList.push(this._makeRootThemesDir());
    taskList.push(this._loadRemoteThemeConfig(config));
    ctx.count = taskList.length;
    return compose(taskList)(ctx);
  }


  private _loadRemoteThemeConfig(config: TypeThemeConfig): Function {
    const baseDir: string = this._opts.baseDir;

    return async(ctx: TypeRemoteThemeLoaderTaskContext, next: Function) => {
      ctx.index ++;
      taskLogger(ctx, `loading remote theme@${config.name} config ...`);
      const fullPath = path.join(baseDir, "themes", config.name);
      if (fs.existsSync(fullPath)) {
        taskLogger(ctx, `theme@${config.name}\'s dir is existed`);
      } else {
        Deno.mkdirSync(fullPath); 
        const res = await fetch(config.configLink);
        const json = await res.json();
        const configFullPath: string = path.join(fullPath, 'denopress.theme.json');
        taskLogger(ctx, `writing remote theme@${config.name} config ...`);
        fs.writeJsonSync(configFullPath, json, {
          spaces: 2,
        });
        await next();
      }
    }
  }

  private _makeRootThemesDir(): Function {
    return async  (ctx: TypeRemoteThemeLoaderTaskContext, next: Function) => {
      ctx.index ++;
      taskLogger(ctx, 'making root themes dir ...');
      const baseDir: string = this._opts.baseDir;
      const fullPath = path.join(baseDir, 'themes');
      const status = fs.existsSync(fullPath);
      if (!status) {
        Deno.mkdirSync(fullPath); 
      }
      await next();
    }
  }


}