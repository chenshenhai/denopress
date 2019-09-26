import {
  TypeTemplate,
  TypeUnitAST,
  TypeUnitASTPropType
} from "./types.ts";
import { Unit } from "./unit.ts";

export class Template implements TypeTemplate {

  private _tpl: string;
  private _ast: TypeUnitAST|null = null;
  private _unitList: Unit[];

  constructor(tpl: string) {
    this._tpl = tpl;
  }

  public getAST(): TypeUnitAST {
    if (this._ast) {
      return this._ast;
    }

    const ast = this._compileToAST();
    return ast;
    // return {
    //   tagName: '',
    //   children: [],
    //   content: '',
    //   type: TypeUnitASTPropType.TEXT,
    //   start: -1,
    //   end: -1,
    //   contentLength: -1,
    // }
  }

  public compileToHTML(data: object): string {
    return '';
  }

  private _compileToAST(): TypeUnitAST|null {
    const tagReg = /<[^>^<].*>/ig;
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
        const contentEnd: number = end - 1;
        const content: string = this._tpl.substring(contentStart, contentEnd);
        item.setContent(content);
      }
    });

    console.log('unitList = ', JSON.stringify(unitList));
    return null;
  }

}

