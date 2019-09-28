import {
  TypeTemplate,
  TypeUnitAST,
  TypeUnitASTPropType,
  TypeTagAST
} from "./types.ts";
import { Unit } from "./unit.ts";
import { Tag, parseTagAST } from "./tag.ts";

export class Template implements TypeTemplate {

  private _tpl: string;
  private _ast: TypeTagAST[]|null = null;
  private _unitList: Unit[];

  constructor(tpl: string) {
    this._tpl = tpl;
  }

  public getAST(): TypeTagAST[] {
    if (this._ast) {
      return this._ast;
    }

    const ast = this._compileToAST();
    this._ast = ast;
    return ast;
  }

  public compileToHTML(data: object): string {
    const html = parseTagAST(this._ast);
    return html;
  }

  private _compileToAST(): TypeTagAST[]|null {
    const tagReg = /<[^>^<]*>/ig;
    const unitList = [];
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
    
    // TODO
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
    // console.log('unitList = ', JSON.stringify(unitList));
    // console.log(' ------------------------------------- ')
    // console.log('rootTag = ', JSON.stringify(rootTag));
    return ast;
  }

}

