import { Template } from "./template.ts";

const tplStr: string = `
<div>
  <h1 class="show-title">
    hello >< world
  </h1>
  <div class="show-list">

    <ul class="show-item" @:for-array="list" @:for-item="item" @:for-index="idx">
      <li> list[ {{idx}} ] = {{item}}</li>
    </ul>

    <div class="show-json" @:for-json="json" @:for-key="key" @:for-value="val">
      <span> json[ {{key}} ] = {{val}}</span>
    </div>

    <div class="show-if" @:if="isShow">
      before text
      <div>{{str}}</div>
      after text
    </div>

  </div>
</div>
`;


const tpl = new Template(tplStr);
const ast = tpl.getAST();
const html = tpl.compile({
  list: [ 'item-001', 'item-002', 'item-003', 'item-004'],
  json: {
    'key-001': 'val-001',
    'key-002': 'val-002',
    'key-003': 'val-003',
  },
  isShow: true,
  str: 'Hello! I am a string!',
});

console.log(JSON.stringify(ast));
console.log('----------------------');
console.log(html);
