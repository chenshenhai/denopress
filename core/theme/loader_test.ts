import "./global.js"
import { testing, asserts, bufio } from "./../../deps.ts";
const { test, runTests  } = testing;
const { assert, equal } = asserts;
const { BufReader } = bufio;


import { ThemeLoader, ThemeListLoader } from "./loader.ts";


test(async function testThemeLoader() {
  const path = [Deno.cwd(), 'assets/theme/theme_script'].join('/')
  const loader = new ThemeLoader({
    path,
  })
  
  const theme = await loader.loadTheme();
  
  assert(equal(theme.config, {
    "name": "portal",
    "pages": [
      "pages/home",
      "pages/tpl"
    ]
  }));

  const script = theme.pageScriptMap.get('pages/tpl');
  const tpl = script.template;
  const data = script.controller.data();
  const html = tpl(data);
  const expectResult = `<html >  <head >    <title >    </title><link rel="stylesheet" href="/static/portal/css/index.css" />    </head><body >        <div >      <h1 class="show-title">        hello >< world            </h1><div class="show-list">                          <ul class="show-item">          <li > list[ 0 ] = item-001        </li>            </ul>              <ul class="show-item">          <li > list[ 1 ] = item-002        </li>            </ul>              <ul class="show-item">          <li > list[ 2 ] = item-003        </li>            </ul>              <ul class="show-item">          <li > list[ 3 ] = item-004        </li>            </ul>                          <ul class="show-child-item">                        <ul class="show-child-item">            <li > list[ 0-0 ] = child-1-1          </li>        </ul>              <ul class="show-child-item">            <li > list[ 0-1 ] = child-1-2          </li>        </ul>                        </ul>              <ul class="show-child-item">                        <ul class="show-child-item">            <li > list[ 1-0 ] = child-2-1          </li>        </ul>              <ul class="show-child-item">            <li > list[ 1-1 ] = child-2-2          </li>        </ul>              <ul class="show-child-item">            <li > list[ 1-2 ] = child-3-2          </li>        </ul>                        </ul>                          <div class="show-if">          before text          <div >Hello! I am a string!          after text        </div>          </div>                </div>  </div>  </body><script src="/static/portal/js/index.js"></script></html>`; 
  assert(equal(html, expectResult));
});

test(async function testThemeListLoader() {
  const basePath = [Deno.cwd(), 'assets/theme/'].join('/')
  const loader = new ThemeListLoader({
    basePath,
    themeList: [
      'theme_script',
    ]
  })
  
  const themeList = await loader.loadThemeList();
  assert(equal(1, 1));

  const theme = themeList[0];
  assert(equal(theme.config, {
    "name": "portal",
    "pages": [
      "pages/home",
      "pages/tpl"
    ]
  }));

  const script = theme.pageScriptMap.get('pages/tpl');
  const tpl = script.template;
  const data = script.controller.data();
  const html = tpl(data);
  const expectResult = `<html >  <head >    <title >    </title><link rel="stylesheet" href="/static/portal/css/index.css" />    </head><body >        <div >      <h1 class="show-title">        hello >< world            </h1><div class="show-list">                          <ul class="show-item">          <li > list[ 0 ] = item-001        </li>            </ul>              <ul class="show-item">          <li > list[ 1 ] = item-002        </li>            </ul>              <ul class="show-item">          <li > list[ 2 ] = item-003        </li>            </ul>              <ul class="show-item">          <li > list[ 3 ] = item-004        </li>            </ul>                          <ul class="show-child-item">                        <ul class="show-child-item">            <li > list[ 0-0 ] = child-1-1          </li>        </ul>              <ul class="show-child-item">            <li > list[ 0-1 ] = child-1-2          </li>        </ul>                        </ul>              <ul class="show-child-item">                        <ul class="show-child-item">            <li > list[ 1-0 ] = child-2-1          </li>        </ul>              <ul class="show-child-item">            <li > list[ 1-1 ] = child-2-2          </li>        </ul>              <ul class="show-child-item">            <li > list[ 1-2 ] = child-3-2          </li>        </ul>                        </ul>                          <div class="show-if">          before text          <div >Hello! I am a string!          after text        </div>          </div>                </div>  </div>  </body><script src="/static/portal/js/index.js"></script></html>`; 
  assert(equal(html, expectResult));
});

runTests();