export interface TypeThemePressConfig {
  name: string;
  version: string;
  pages: string[];
}

export interface TypeThemeConfig {
  name: string;
  version?: string;
  configLink: string;
}


export interface TypeThemePageControllerDataOpts {
  api?: TypeThemeServiceAPI;
}

export interface TypeThemePageController {
  data(opts?: TypeThemePageControllerDataOpts): {
    [key: string]: any;
  };
}

export interface TypeThemePageScript {
  path: string;
  template: Function;
  controller: TypeThemePageController;
}

export interface TypeTheme {
  config: TypeThemePressConfig;
  pageScriptMap: Map<string, TypeThemePageScript>;
}


export interface TypeThemeLoader {
  reset(): Promise<TypeThemePressConfig>
  reloadTheme(): Promise<TypeTheme>;
  reloadThemePage(page: string): Promise<TypeThemePageScript>;
  reloadConfig(): TypeThemePressConfig;

  hasConfig(): boolean;
  getConfig(): TypeThemePressConfig|undefined;
  exist(): boolean;
  existPage(page: string): boolean;
  hasPage(page: string): boolean;
  getPage(page: string): TypeThemePageScript|undefined;
}


export interface TypeThemeLoaderOpts {
  path: string;
}

export interface TypeThemeLoaderHubOpts {
  basePath: string;
  themeList: string[];
}

export interface TypeThemeLoaderHub {

  resetAllThemes(): Promise<void>
  existTheme(theme: string): boolean;
  existThemePage(theme: string, page: string): boolean;
  hasTheme(theme: string): boolean;
  hasThemePage(theme: string, page: string): boolean;
  getThemePage(theme: string, page: string): TypeThemePageScript|undefined;
  addTheme(theme: string): void;
  reloadThemePage(theme: string, page: string): Promise<TypeThemePageScript|undefined>
}


export interface TypeThemeServerOpts {
  path: string;
  themeList?: string[];
  serviceFrontAPI?: TypeThemeServiceAPI;
  serviceServerAPI?: TypeThemeServiceAPI;
  hotLoading?: boolean;
}

export interface TypeThemeServiceAPI {
  [key: string]: TypeThemeAPI
}

export interface TypeThemeAPI {
  [key: string]: Function;
}

export interface TypeReadPageResult {
  status: number;
  content: string;
}


export interface TypeRemoteThemeLoaderOpts {
  baseDir: string;
}

export interface TypeRemoteThemeLoader {
  loadRemoteTheme(config: TypeThemeConfig): Promise<void>;
}

export interface TypeRemoteThemeLoaderTaskContext {
  index: number;
  count: number;
  remoteFileLinkList: string[]
}