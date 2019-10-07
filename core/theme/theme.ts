
// const pageMap: Map<string, Function> = new Map();
// const themeMap: Map<string, Map<string, Function>> = new Map();
function ThemePage (page): object {
  return page;
}


// const ajaxMap: Map<string, Function> = new Map();
function ThemeAjax (api): object {
  return api;
}

export const $Theme = {
  Page: ThemePage,
  Ajax: ThemeAjax,
}



