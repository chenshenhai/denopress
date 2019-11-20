import { testing, asserts } from "./../../deps.ts";
import { Template } from "./template.ts";

const { test, runTests } = testing;
const { assertEquals } = asserts;

const readFileSync = Deno.readFileSync;
const decoder = new TextDecoder();

test(function testCompileTemplate() {
  const buf = readFileSync('./assets/tpl.html');
  const tplStr: string = decoder.decode(buf);

  const tpl = new Template(tplStr);
  const html = tpl.compile({
    list: [ 'item-001', 'item-002', 'item-003', 'item-004'],
    listChild: [
      {
        name: "item-1",
        children: [
          {
            name: "child-1-1",
          },
          {
            name: "child-1-2",
          }
        ]
      },
      {
        name: "item-2",
        children: [
          {
            name: "child-2-1",
          },
          {
            name: "child-2-2",
          },
          {
            name: "child-3-2",
          }
        ]
      }
    ],
    isShow: true,
    str: 'Hello! I am a string!',
  });

  const expectedResult = `<div >  <h1 class="show-title">    hello >< world    </h1><div class="show-list">                  <ul class="show-item">      <li > list[ 0 ] = item-001    </li>    </ul>              <ul class="show-item">      <li > list[ 1 ] = item-002    </li>    </ul>              <ul class="show-item">      <li > list[ 2 ] = item-003    </li>    </ul>              <ul class="show-item">      <li > list[ 3 ] = item-004    </li>    </ul>                          <ul class="show-child-item">                    <ul class="show-child-item">        <li > list[ 0-0 ] = child-1-1      </li>    </ul>              <ul class="show-child-item">        <li > list[ 0-1 ] = child-1-2      </li>    </ul>                </ul>              <ul class="show-child-item">                    <ul class="show-child-item">        <li > list[ 1-0 ] = child-2-1      </li>    </ul>              <ul class="show-child-item">        <li > list[ 1-1 ] = child-2-2      </li>    </ul>              <ul class="show-child-item">        <li > list[ 1-2 ] = child-3-2      </li>    </ul>                </ul>                          <div class="show-if">      before text      <div >Hello! I am a string!      after text    </div>  </div>            </div></div>`;
  assertEquals(expectedResult, html);
});

test(function testCompileFunc() {
  const buf = readFileSync('./assets/tpl.html');
  const tplStr: string = decoder.decode(buf);

  const tpl = new Template(tplStr);
  const func = tpl.compileToFunc();
  const html = func({
    list: [ 'item-001', 'item-002', 'item-003', 'item-004'],
    listChild: [
      {
        name: "item-1",
        children: [
          {
            name: "child-1-1",
          },
          {
            name: "child-1-2",
          }
        ]
      },
      {
        name: "item-2",
        children: [
          {
            name: "child-2-1",
          },
          {
            name: "child-2-2",
          },
          {
            name: "child-3-2",
          }
        ]
      }
    ],
    isShow: true,
    str: 'Hello! I am a string!',
  });

  const expectedResult = `<div >  <h1 class="show-title">    hello >< world    </h1><div class="show-list">                  <ul class="show-item">      <li > list[ 0 ] = item-001    </li>    </ul>              <ul class="show-item">      <li > list[ 1 ] = item-002    </li>    </ul>              <ul class="show-item">      <li > list[ 2 ] = item-003    </li>    </ul>              <ul class="show-item">      <li > list[ 3 ] = item-004    </li>    </ul>                          <ul class="show-child-item">                    <ul class="show-child-item">        <li > list[ 0-0 ] = child-1-1      </li>    </ul>              <ul class="show-child-item">        <li > list[ 0-1 ] = child-1-2      </li>    </ul>                </ul>              <ul class="show-child-item">                    <ul class="show-child-item">        <li > list[ 1-0 ] = child-2-1      </li>    </ul>              <ul class="show-child-item">        <li > list[ 1-1 ] = child-2-2      </li>    </ul>              <ul class="show-child-item">        <li > list[ 1-2 ] = child-3-2      </li>    </ul>                </ul>                          <div class="show-if">      before text      <div >Hello! I am a string!      after text    </div>  </div>            </div></div>`;
  assertEquals(expectedResult, html);
});


runTests();
