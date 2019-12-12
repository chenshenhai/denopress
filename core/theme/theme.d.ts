// interface Context {
//   getUrlParams(): {[key: string]: string}
// }

// interface Api {
//   [key: string]: {[key: string]: Function}
// }

declare namespace $Theme {
  function Page(data: any): any;
  class Context {
    getUrlParams(): Promise<{[key: string]: string}>;
    getCookies(): Promise<{[key: string]: string}>;
    redirect(url: string): void
  }
  class Api {
    [key: string]: {[key: string]: Function}
  }
}