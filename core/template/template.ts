import {
  TypeTemplate,
  TypeUnitAST,
  TypeUnitASTPropType,
  TypeTagAST
} from "./types.ts";
import { Unit } from "./unit.ts";
import { Tag, parseTagASTToScriptTpl } from "./tag.ts";
import { compileToFunction } from "./script_template.ts";


export class Template implements TypeTemplate {

  private _tpl: string;
  private _ast: TypeTagAST[]|null = null;
  private _scriptFunc: Function|null = null;

  constructor(tpl: string) {
    this._tpl = tpl;
  }

  public compile(data: object): string {
    const scriptFunc = this.compileToFunc();
    const html = scriptFunc(data)
    return html;
  }

  public compileToFunc(): Function {
    if (this._scriptFunc) {
      return this._scriptFunc;
    }
    const ast = this._getAST();
    const scriptTpl = parseTagASTToScriptTpl(ast);
    const scriptFunc = compileToFunction(scriptTpl);
    this._scriptFunc = scriptFunc;
    return scriptFunc;
  }


  private _getAST(): TypeTagAST[] {
    if (this._ast) {
      return this._ast;
    }

    const ast = this._compileToAST();
    this._ast = ast;
    return ast;
  }

  private _compileToAST(): TypeTagAST[] {
    const tagReg = /<[^>^<]*>/ig;
    const unitList: any[] = [];
    this._tpl.replace(tagReg, (match: string, idx: number) => {
      const unit: Unit = new Unit(match);
      unit.setStart(idx);
      unitList.push(unit);
      return match;
    });
    
    unitList.forEach((item: Unit, idx: number) => {
      const nextUnit = unitList[idx + 1];
      if (nextUnit) {
        const start: number = item.getStart();
        const end: number = nextUnit.getStart() - 1;
        item.setEnd(end);
        const contentStart: number = start + item.getTplLength();
        const contentEnd: number = end;
        const content: string = this._tpl.substring(contentStart, contentEnd + 1);
        item.setContent(content);
      }
    });

    let level: number = 0;
    let rootUnit = new Unit('<root>');
    let rootTag = new Tag(rootUnit.getAST());
    let preTag: Tag = rootTag;
    let levelTagStack: Tag[] = [preTag];
    const { TAG_START, TAG_NO_CLOSE, TAG_END, TEXT, } = TypeUnitASTPropType;
    
    unitList.forEach((unit: Unit, idx: number) => {
      const type = unit.getType();
      const tag = new Tag(unit.getAST());

      if (type === TAG_START) {
        levelTagStack.push(tag);
        preTag.children.push(tag);
        level ++;
      } else if (type === TAG_NO_CLOSE || type === TEXT) {
        preTag.children.push(tag);
      } else if (type === TAG_END) {
        preTag.children.push(tag);
        levelTagStack.pop();
        level --;
      }

      if (level >= 0) {
        preTag = levelTagStack[level];
      } else {
        preTag = rootTag;
      }
    });

    let ast = rootTag.children;
    return ast;
  }

}

