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
  loadTheme(): Promise<TypeTheme>;
  reloadThemePage(page: string): Promise<TypeThemePageScript>

  // loadConfig(): boolean;
  // reloadConfig(): boolean;
  // hasConfig(): boolean;

  // exist(): boolean;
  // existPage(page: string): boolean;
  // hasPage(page: string): boolean;
}


export interface TypeThemeLoaderOpts {
  path: string;
}

export interface TypeThemeListLoaderOpts {
  basePath: string;
  themeList: string[];
}

export interface TypeThemeListLoader {
  loadThemeMap(): Promise<Map<string, TypeTheme>>

  hasThemeConfig(theme: string): boolean;
  hasThemePageConfig(theme: string, page: string): boolean;

  existTheme(theme: string): boolean;
  existThemePage(theme: string, page: string): boolean;

  // reloadThemeConfig(theme: string): boolean;
  // getThemePage(theme: string, page: string): Promise<TypeThemePageScript|undefined>
  // addTheme(): boolean;
  // deleteTheme(): boolean;
  // reloadTheme(): boolean;
  
  reloadThemePage(theme: string, page: string): Promise<TypeThemePageScript|undefined>
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