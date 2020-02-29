// Copyright 2018-2019 chenshenhai. All rights reserved. MIT license.

// This code has been ported almost directly from  https://github.com/chenshenhai/html-ast-parser/blob/master/src/lib/tags.js
// Copyright 2017 The Authors. All rights reserved. MIT license.
// https://github.com/chenshenhai/html-ast-parser/blob/master/LICENSE

import {
  TypeTagAST,
  TypeUnitAST,
  TypeASTAttr,
  TypeASTDirect,
  TypeUnitASTPropType,
  TypeData,
} from "./types.ts";
import { isType } from "./../util/is_type.ts";
import { legalTags, notClosingTags } from "./tag_info.ts";

const { TAG_NO_CLOSE, TAG_START, TAG_END, TEXT } = TypeUnitASTPropType;

export class Tag implements TypeTagAST {
  public tag: string | null = null;
  public children: TypeTagAST[];
  public text: string;
  public attributes: TypeASTAttr;
  public directives: TypeASTDirect;


  constructor(unitAst: TypeUnitAST) {
    if(unitAst.type === TAG_START || unitAst.type === TAG_NO_CLOSE) {
      this.tag = unitAst.tagName;
    }
    this.text = unitAst.content;
    this.children = [];
    this.attributes = unitAst.attributes;
    this.directives = unitAst.directives;
  }
}

function escapeStr (str: string) {
  str = `${str}`
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quot;')
  str = str.replace(/'/g, '&#39;')
  return str
}

function parseChildren (children: TypeTagAST[]) {
  let html = '';
  if (isType.array(children) !== true) {
    return html;
  }
  for (let i = 0; i < children.length; i++) {
    const item = children[i];
    if (isType.json(item) === true) {
      html += parseTag(item);
    } else if (isType.string(item)) {
      html += item;
    }
  }
  return html;
}

function parseAttribute (attribute: TypeASTAttr) {
  let attrStr = ''
  if (isType.json(attribute) !== true) {
    return attrStr
  }
  let keyList = Object.keys(attribute)
  const attrList: string[] = [];
  for (let i = 0; i < keyList.length; i++) {
    let keyName = keyList[i]
    let val = attribute[keyName]
    if (isType.string(val) === true && val) {
      attrList.push(`${keyName}="${escapeStr(val)}"`);
    }
  }
  attrStr = attrList.join(' ');
  return attrStr
}


const scriptTplKeyword = '@#@';
function parseTag (ast: TypeTagAST): string {

  let html = '';
  if (isType.json(ast) !== true) {
    return html
  }
  let tagName = ast.tag;
  if (isType.string(tagName) && tagName) {
    const children: TypeTagAST[] = ast.children;
    const attrStr = parseAttribute(ast.attributes);
    
    if (tagName && notClosingTags[tagName] === true) {
      html = `<${tagName} ${attrStr} />${ast.text}`;
    } else {
      html = `<${tagName} ${attrStr}>${ast.text}${parseChildren(children)}</${tagName}>`;
    }

    const directives = ast.directives;
    const direcIf = directives['@:if'];
    const direcFor = directives['@:for'];
    const direcIndex = directives['@:index'];
    // const direcItem = directives['@:item'];
    if (isType.string(direcIf)) {
      html = `
      ${scriptTplKeyword}if(${direcIf})
        ${html}
      ${scriptTplKeyword}/if
      `;
    } else if (isType.string(direcFor)) {
      let asStr = '';
      if (isType.string(direcIndex)) {
        asStr += `.indexAs(${direcIndex})`;
      }
      // if (isType.string(direcItem)) {
      //   asStr += `.itemAs(${direcItem})`;
      // }

      html = `
      ${scriptTplKeyword}foreach(${direcFor})${asStr}
        ${html}
      ${scriptTplKeyword}/foreach
      `
    } 
    
  } else {
    html = ast.text;
  }
  return html
}


export function parseTagASTToScriptTpl (ast: TypeTagAST|TypeTagAST[]): string {
  let html = '';
  if (isType.json(ast)) {
    html = parseTag(ast as TypeTagAST)
  } else if (isType.array(ast)) {
    html = parseChildren(ast as TypeTagAST[])
  }
  return html
}
