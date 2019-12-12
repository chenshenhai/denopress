// const pageMap: Map<string, Function> = new Map();
// const themeMap: Map<string, Map<string, Function>> = new Map();
function ThemePage (page: any): object {
  return page;
}

// interface TypeContext {
//   getCookie(name: string): string|undefined;
//   setCookie(name: string, value: string): void;
//   getUrlParams(): {[key: string]: string};
// }

// interface TypeApp {
//   controller: {
//     [key: string]: Function;  
//   }
// }

export const $Theme = {
  Page: ThemePage,
}



