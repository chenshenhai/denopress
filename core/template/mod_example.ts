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

    <div class="show-if" @:if="{{isShow}}">
      <div>display data</div>
    </div>

  </div>
</div>
`;

const tpl = new Template(tplStr);
const ast = tpl.getAST();

console.log(ast);
