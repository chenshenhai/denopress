// Copyright 2018-2019 chenshenhai. All rights reserved. MIT license.

// This code has been ported almost directly from  https://github.com/chenshenhai/deno_note/blob/master/demo/template/mod.ts
// Copyright 2017 The Authors. All rights reserved. MIT license.
// https://github.com/chenshenhai/deno_note/blob/master/LICENSE


const funcParamKey = "__DATA__";

function compileToFunctionContentStr (tpl: string) {
  const tplCode = tpl;
  const regTpl = /\@#\@if[\s]{0,}\(([^\)]+)?\)|\@#\@elseif[\s]{0,}\(([^\)]+)?\)|\@#\@else|\(([^\)]+)?\)|\@#\@foreach[\s]{0,}\(([^\)]+)?\)\.indexAs\(([^\)]+)?\)|\@#\@foreach[\s]{0,}\(([^\)]+)?\)\.keyAs\(([^\)]+)?\)|{{([^}}]+)?}}|\@#\@\/if|\@#\@\/foreach/ig;
  const regDirectEnd = /\@#\@\/if|\@#\@\/foreach/i;
  const regDirectIf = /\@#\@if[\s]{0,}\(([^\)]+)?\)/i;
  const regDirectElse = /\@#\@else[\s]{0,}/i;
  const regDirectElseif = /\@#\@elseif[\s]{0,}\(([^\)]+)?\)/i;
  const regDirectForArray: RegExp = /\@#\@foreach[\s]{0,}\(([^\)]+)?\)\.indexAs\(([^\)]+)?\)/i;
  const regDirectForJSON: RegExp = /\@#\@foreach[\s]{0,}\(([^\)]+)?\)\.keyAs\(([^\)]+)?\)/i;
  const regData = /{{([^}}]+)?}}/i;
  const directiveStock: any[] = [];
  let funcCodeStr = "";
  let match = true;
  let codeIndex = 0;
  funcCodeStr += "\r\n let _row=[];\r\n";

  const addFuncCode = function (params: any) {
    const { currentExec, restCode } = params;

    if (regData.test(currentExec) === true) {
      // set data
      const result = regData.exec(currentExec);
      if (result && result[1]) {
        funcCodeStr += `\r\n _row.push(${result[1]});`;
      }
    } else if (regDirectIf.test(currentExec) === true) {
      const result = regDirectIf.exec(currentExec);
      if (result && result[1]) {
        funcCodeStr += `\r\n if ( ${result[1]} ) {`;
        directiveStock.push("if");
      }
    } else if (regDirectElseif.test(currentExec) === true) {
      const result = regDirectElseif.exec(currentExec);
      if (result && result[1]) {
        funcCodeStr += `\r\n } else if ( ${result[1]} ) {`;
      }
    } else if (regDirectElse.test(currentExec) === true) {
      funcCodeStr += `\r\n } else {`;
    } else if (regDirectForArray.test(currentExec) === true) {      

      const resultForArrayName: any = regDirectForArray.exec(currentExec);
      const resultForArrayIndexName: any = regDirectForArray.exec(currentExec);

      if (resultForArrayName && resultForArrayName[0] && resultForArrayIndexName) {
        const forArrayName: any =resultForArrayName[1];
        const forArrayIndexName: any = resultForArrayIndexName[2] || "idx";
        funcCodeStr += `
        \r\n for ( let ${forArrayIndexName}=0; ${forArrayIndexName}<${forArrayName}.length; ${forArrayIndexName}++ ) {
        `;
        directiveStock.push("for-array");
      }
    } else if (regDirectForJSON.test(currentExec) === true) {

      const resultForJSONName = regDirectForJSON.exec(currentExec);
      let forJSONName: string = '';
      if (resultForJSONName && resultForJSONName[1]) {
        forJSONName = resultForJSONName[1]
      }

      let forJSONKey: string = 'key';
      const resultForJSON = regDirectForJSON.exec(currentExec);
      if (resultForJSON && resultForJSON[2]) {
        forJSONKey = resultForJSON[2];
      }
      funcCodeStr += `
      \r\n for ( const ${forJSONKey} in ${forJSONName} ) {
      `;
      directiveStock.push("for-json");
    } else if (regDirectEnd.test(currentExec) === true) {
      funcCodeStr += `\r\n }`;
      directiveStock.pop();
    } else {
      funcCodeStr += `\r\n _row.push(\`${restCode}\`); `;
    }
  };

  let excecResult;
  while (match) {
    // console.log(`tplCode = ${tplCode} \r\r\n`)
    excecResult = regTpl.exec(tplCode);
    if (match && excecResult) {
      const restCode = tplCode.slice(codeIndex, excecResult.index);
      const currentExec = excecResult[0];
      const currentMatch = excecResult[1];
      addFuncCode({ restCode, currentExec: '' });
      addFuncCode({ currentExec, currentMatch, restCode });
      codeIndex = excecResult.index + excecResult[0].length;
    } else {
      match = false;
    }
  }
  addFuncCode({
    restCode: tplCode.substr(codeIndex, tplCode.length),
    currentExec: '',
  });

  funcCodeStr += `\r\n return _row.join("");`;
  funcCodeStr = funcCodeStr.replace(/[\r\t\r\n]/g, "");
  return funcCodeStr;
}

export function compileToFunction(tpl: string): Function {
  const funcContentStr = compileToFunctionContentStr(tpl);
  const funcStr = [`with(${funcParamKey}) {`, funcContentStr, '}'].join('\r\n');
  const func = new Function(funcParamKey, funcStr.replace(/[\r\t\r\n]/g, ""));
  return func;
}

export function compile(tpl: string, data: object) {
  const func = compileToFunction(tpl);
  const html = func(data);
  return html;
}




