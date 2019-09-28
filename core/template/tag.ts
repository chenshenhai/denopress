// Copyright 2018-2019 chenshenhai. All rights reserved. MIT license.

// This code has been ported almost directly from  https://github.com/chenshenhai/html-ast-parser/blob/master/src/lib/tags.js
// Copyright 2017 The Authors. All rights reserved. MIT license.
// https://github.com/chenshenhai/html-ast-parser/blob/master/LICENSE

import {
  TypeTagAST,
  TypeUnitAST,
  TypeTagASTAttr,
  TypeTagASTDirect,
  TypeUnitASTPropType,
} from "./types.ts";
import { isType } from "./../util/is_type.ts";
import { legalTags, notClosingTags } from "./tag_info.ts";

const { TAG_CLOSE, TAG_START, TAG_END, TEXT } = TypeUnitASTPropType;

export class Tag implements TypeTagAST {
  tag: string | null = null;
  children: TypeTagAST[];
  text: string;
  attributes: TypeTagASTAttr;
  directives: TypeTagASTDirect;

  constructor(unitAst: TypeUnitAST) {
    if(unitAst.type === TAG_START || unitAst.type === TAG_CLOSE) {
      this.tag = unitAst.tagName;
    }
    this.text = unitAst.content;
    this.children = [];
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

function parseChildren (content: TypeTagAST[]) {
  let html = '';
  if (isType.array(content) !== true) {
    return html;
  }
  for (let i = 0; i < content.length; i++) {
    console.log('parseChildren ====== ', content.length)
    const item = content[i];
    if (isType.json(item) === true) {
      html += parseTag(item);
    } else if (isType.string(item)) {
      html += item;
    }
  }
  return html;
}

function parseAttribute (attribute: object) {
  let attrStr = ''
  if (isType.json(attribute) !== true) {
    return attrStr
  }
  let keyList = Object.keys(attribute)
  const attrList: string[] = [' '];
  for (let i = 0; i < keyList.length; i++) {
    let keyName = keyList[i]
    let val = attribute[keyName]
    if (isType.string(val) === true) {
      attrList.push(`${keyName}="${escapeStr(val)}"`);
    }
  }
  attrList.push(' ');
  attrStr = attrList.join(' ');
  return attrStr
}

function parseTag (ast: TypeTagAST): string {

  let html = ''
  if (isType.json(ast) !== true) {
    return html
  }
  let tagName = ast.tag;
  if (isType.string(tagName)) {
    const children: TypeTagAST[] = ast.children;
    // if (legalTags.indexOf(tagName) < 0) {
    //   tagName = 'div'
    // }
    const attrStr = parseAttribute(ast.attributes)
    if (notClosingTags[tagName] === true) {
      html = `<${tagName}${attrStr} />${ast.text}`;
    } else {
      html = `<${tagName}${attrStr}>${ast.text}${parseChildren(children)}</${tagName}>`;
    }
  } else {
    html = ast.text;
  }
  
  return html
}

export function parseTagAST (ast: TypeTagAST|TypeTagAST[]): string {
  let html = '';
  if (isType.json(ast)) {
    html = parseTag(ast as TypeTagAST)
  } else if (isType.array(ast)) {
    html = parseChildren(ast as TypeTagAST[])
  }
  return html
}

