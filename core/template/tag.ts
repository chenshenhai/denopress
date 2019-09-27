// Copyright 2018-2019 chenshenhai. All rights reserved. MIT license.

// This code has been ported almost directly from  https://github.com/chenshenhai/html-schema-parser/blob/master/src/lib/tags.js
// Copyright 2017 The Authors. All rights reserved. MIT license.
// https://github.com/chenshenhai/html-schema-parser/blob/master/LICENSE

import {
  TypeTagAST,
  TypeUnitAST,
  TypeTagASTAttr,
  TypeTagASTDirect
} from "./types.ts";
import { isType } from "./../util/is_type.ts";
import { legalTags, notClosingTags } from "./tag_info.ts";

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

function escapeStr (str) {
  str = `${str}`
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quot;')
  str = str.replace(/'/g, '&#39;')
  return str
}

function parseContent (content) {
  let html = ''
  if (isType.array(content) !== true) {
    return html
  }
  for (let i = 0; i < content.length; i++) {
    const item = content[i]
    if (isType.json(item) === true) {
      html += parseTag(item)
    } else if (isType.string(item)) {
      html += item
    }
  }
  return html
}

function parseAttribute (attribute) {
  let attrStr = ''
  if (isType.json(attribute) !== true) {
    return attrStr
  }
  let keyList = Object.keys(attribute)
  let attrList = []
  for (let i = 0; i < keyList.length; i++) {
    let keyName = keyList[i]
    let val = attribute[keyName]
    if (isType.string(val) === true) {
      attrList.push(`${keyName}="${escapeStr(val)}"`)
    }
  }
  attrStr = attrList.join('  ')
  return attrStr
}

function parseTag (schema) {
  let html = ''
  if (isType.json(schema) !== true) {
    return html
  }
  let tagName = schema.tag;
  if (!isType.string(tagName)) {
    const content = schema.content
    if (legalTags.indexOf(tagName) < 0) {
      tagName = 'div'
    }
    const attrStr = parseAttribute(schema.attribute)
    if (notClosingTags[tagName] === true) {
      html = `<${tagName} ${attrStr} />`
    } else {
      html = `<${tagName} ${attrStr} >${parseContent(content)}</${tagName}>`
    }
  } else {
    html = schema.text;
  }
  
  return html
}

export function parseTagAST (schema) {
  let html = ''
  if (isType.json(schema)) {
    html = parseTag(schema)
  } else if (isType.array(schema)) {
    html = parseContent(schema)
  }
  return html
}

