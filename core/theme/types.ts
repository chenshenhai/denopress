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


export interface TypeThemeLoader {
  reset(): Promise<TypeThemeConfig>
  reloadTheme(): Promise<TypeTheme>;
  reloadThemePage(page: string): Promise<TypeThemePageScript>;
  reloadConfig(): TypeThemeConfig;

  hasConfig(): boolean;
  getConfig(): TypeThemeConfig|undefined;
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

  // loadAllThemeMap(): Promise<Map<string, TypeTheme>>
  // hasThemeConfig(theme: string): boolean;
  // hasThemePageConfig(theme: string, page: string): boolean;
  
  // reloadThemeConfig(theme: string): boolean;
  // getThemePage(theme: string, page: string): Promise<TypeThemePageScript|undefined>
  // deleteTheme(): boolean;
  // removeTheme(): boolean;
  // reloadTheme(): boolean;
  
}


export interface TypeThemeServerOpts {
  path: string;
  themeList?: string[];
  themeServiceAPI?: TypeThemeServiceAPI;
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