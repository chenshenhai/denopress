import {
  TypeTemplateUnit,
  TypeUnitAST,
  TypeUnitASTPropType,
} from "./types.ts";

const closeTagList = [
  "img", "br", "hr", "area", "base", "input", "link", "meta", "basefont", "param", "col", "frame", "embed" 
];

function getTagName(str: string): string|null {
  const reg = /<[\/]{0,}([a-z])[\S]{0,}[\/]{0,}>/i;
  const matchList = str.match(reg);
  if (matchList && typeof matchList[0] === "string") {
    return matchList[0].replace(/^<[\/]{0,1}/, "").replace(/[\/]{0,1}>$/, "")
  } else {
    return null;
  }
}

export class Unit implements TypeTemplateUnit {

  private _unitTpl: string;
  private _ast: TypeUnitAST;

  constructor(unitTpl: string) {
    this._unitTpl = unitTpl;
    let type: TypeUnitASTPropType = TypeUnitASTPropType.TEXT;
    const tagName = getTagName(unitTpl);
    if(closeTagList.indexOf(tagName) >= 0) {
      type = TypeUnitASTPropType.TAG_CLOSE;
    } else if (/^<[a-z]/i.test(unitTpl)) {
      type = TypeUnitASTPropType.TAG_START;
    } else if (/^<\//i.test(unitTpl)) {
      type = TypeUnitASTPropType.TAG_END;
    }

    this._ast = {
      tagName: tagName,
      content: "",
      type,
      start: -1,
      end: -1
    }
  }

  public getType(): TypeUnitASTPropType {
    return this._ast.type;
  }

  public getTplLength(): number {
    return this._unitTpl.length;
  }

  public getAST(): TypeUnitAST|null {
    return null;
  }

  public getStart(): number {
    return this._ast.start;
  }

  public setStart(start: number): void {
    this._ast.start = start;
  }

  public setEnd(end: number): void {
    this._ast.end = end;
  }

  public getEnd(): number {
    return this._ast.end;
  }

  public setContent(content: string): void {
    this._ast.content = content;
  }

}

