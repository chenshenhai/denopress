import {
  TypeTagAST,
  TypeUnitAST,
  TypeTagASTAttr,
  TypeTagASTDirect
} from "./types.ts";

export class Tag implements TypeTagAST {
  tag: string | null;
  children: TypeTagAST[];
  text: string;
  attributes: TypeTagASTAttr;
  directives: TypeTagASTDirect;

  constructor(unitAst: TypeUnitAST) {
    this.tag = unitAst.tagName;
    this.text = unitAst.content;
    this.children = [];
  }
}