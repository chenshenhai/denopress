import { TypeTemplateUnit, TypeTemplateAST } from "./types.ts";

export class Unit implements TypeTemplateUnit {

  private _unitTpl: string;
  private _ast: TypeTemplateAST;

  constructor(unitTpl: string) {
    this._unitTpl = unitTpl;
  }

  getAST(): TypeTemplateAST|null {
    return null;
  }

}

