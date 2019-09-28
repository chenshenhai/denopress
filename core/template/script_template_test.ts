// Copyright 2018-2019 chenshenhai. All rights reserved. MIT license.

// This code has been ported almost directly from  https://github.com/chenshenhai/deno_note/blob/master/demo/template/test.ts
// Copyright 2017 The Authors. All rights reserved. MIT license.
// https://github.com/chenshenhai/deno_note/blob/master/LICENSE

import { testing, asserts } from "./../../deps.ts";
import { compileTemplate } from "./script_template.ts";

const { test, runTests } = testing;
const { equal } = asserts;


test(function testCompileTemplate() {
  const tpl = `
  <div>
    @#@if( datalist && datalist.length > 0 )
      <ul>
      @#@foreach(datalist).indexAs(i)
        <li>{{i}}:{{datalist[i]}}</li>
      @#@/foreach
      </ul>
    @#@elseif( showOthers === true )
      <p> others </p>
    @#@else
      <p> default </p>
    @#@/if

    @#@if( dataChildList && dataChildList.length > 0 )
      <div>
      @#@foreach(dataChildList).indexAs(i)
        <ul>
        @#@if(dataChildList[i].children)
          @#@foreach(dataChildList[i].children).indexAs(j)
            <li>{{i}}-{{j}} : {{dataChildList[i].children[j].name}}</li>
          @#@/foreach
        @#@/if
        </ul>
      @#@/foreach
      </div>
    @#@/if

    @#@if( datajson)
      <ul>
      @#@foreach(datajson).keyAs(k)
        <li>{{k}}:{{datajson[k]}}</li>
      @#@/foreach
      </ul>
    @#@/if
  </div>`;
  const data = {
    title: "helloworld",
    text: "hellopage",
    isShowDataList: true,
    datalist: [
      "item1", "item2", "item3"
    ],
    dataChildList: [
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
    datajson: {
      "key1": "val1",
      "key2": "val2"
    }
  };
  const html = compileTemplate(tpl, data);
  const expectedResult = `  <div>          <ul>              <li>0:item1</li>              <li>1:item2</li>              <li>2:item3</li>            </ul>              <div>              <ul>                              <li>0-0 : child-1-1</li>                      <li>0-1 : child-1-2</li>                          </ul>              <ul>                              <li>1-0 : child-2-1</li>                      <li>1-1 : child-2-2</li>                      <li>1-2 : child-3-2</li>                          </ul>            </div>              <ul>              <li>key1:val1</li>              <li>key2:val2</li>            </ul>      </div>`;
  equal(expectedResult, html);
  equal(1, 1);
});

runTests();