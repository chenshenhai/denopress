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
}


export interface TypeThemeLoaderOpts {
  path: string;
}

export interface TypeThemeListLoaderOpts {
  basePath: string;
  themeList: string[];
}

export interface TypeThemeListLoader {
  loadThemeList(): Promise<TypeTheme[]>
}


export interface TypeThemeServerOpts {
  path: string;
  themeList?: string[];
  themeServiceAPI?: TypeThemeServiceAPI;
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