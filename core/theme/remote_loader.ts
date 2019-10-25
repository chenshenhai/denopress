import {
  TypeRemoteThemeLoaderOpts,
  TypeRemoteThemeLoader,
  TypeThemeConfig,
} from "./types.ts";


export class RemoteThemeLoader implements TypeRemoteThemeLoader {

  private _opts: TypeRemoteThemeLoaderOpts;
  
  constructor(opts: TypeRemoteThemeLoaderOpts) {
    this._opts = opts;
  }
  
  async loadRemoteTheme(config: TypeThemeConfig): Promise<void> {
    
    console.log('loadRemoteTheme ...');
    console.log(config)
    // TODO
    return Promise.resolve();
  }
}