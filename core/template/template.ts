import { TypeTemplate, TypeTemplateAST, TypeASTPropType } from "./types.ts";

export class Template implements TypeTemplate {

  private _tpl: string;
  private _ast: TypeTemplateAST;

  constructor(tpl: string) {
    this._tpl = tpl;
  }

  public compileToAST(): TypeTemplateAST {
    return {
      tag: '',
      children: [],
      content: '',
      type: TypeASTPropType.TEXT,
      start: -1,
      end: -1,
      contentLength: -1,
    }
  }

  public compileToHTML(data: object): string {
    return '';
  }
}

