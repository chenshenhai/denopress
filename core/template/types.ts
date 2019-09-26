
export interface TypeTemplate {
  getAST(): TypeUnitAST;
  compileToHTML(data: object): string;
}

export interface TypeTemplateUnit  {
  getAST(): TypeUnitAST
}

export enum TypeUnitASTPropType {
  TAG_START = "TAG_START",
  TAG_END = "TAG_END",
  TAG_CLOSE = "TAG_CLOSE",
  TEXT = "TEXT",
}

export interface TypeUnitAST {
  tagName: string;
  content: string;
  type: TypeUnitASTPropType;
  start: number;
  end: number;
}


export interface TypeTagASTAttr {
  [key: string]: string;
}

export interface TypeTagASTDirect {
  [key: string]: string;
}


export interface TypeTagAST {
  tag: string | null;
  children: TypeTagAST[];
  text: string;
  attributes: TypeTagASTAttr;
  directives: TypeTagASTDirect;
}
