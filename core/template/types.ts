
export interface TypeTemplate {
  compileToAST(): TypeTemplateAST;
  compileToHTML(data: object): string;
}

export interface TypeTemplateUnit  {
  getAST(): TypeTemplateAST
}

export enum TypeASTPropType {
  TAG_START = "TAG_START",
  TAG_END = "TAG_END",
  TEXT = "TEXT",
}

export interface TypeTemplateAST {
  tag: string;
  children: TypeTemplateAST[];
  content: string;
  type: TypeASTPropType;
  start: number;
  end: number;
  contentLength: number;
}
