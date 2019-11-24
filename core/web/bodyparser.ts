import { Context } from "./context.ts";

const CONTEXT_FUNC_PARSER_TEXT_KEY = '@moddleware/func/bodyparser/text';

function parseQuerystrToJSON(qs: string): {[key: string]: string} {
  const strList: string[] = qs.split('&');
  const json: {[key: string]: string} = {};
  strList.forEach((str: string) => {
    const keyVal = str.split('=');
    const key = keyVal[0] || '';
    const val = keyVal[1] || '';
    if (key) {
      json[key] = val;
    }
  });
  return json;
}

export function getBodyTextParserKey() {
  return CONTEXT_FUNC_PARSER_TEXT_KEY;
}

export async function bodyTextParser(ctx: Context, next: Function) {
  const method = ctx.req.getMethod();
  const decoder = new TextDecoder();
  async function getFormData(): Promise<{[key: string]: string}|undefined|string> {
    let data: {[key: string]: string}|string|undefined = undefined;
    if (method === 'POST') {
      const stream = await ctx.req.getBodyStream();
      const text = decoder.decode(stream);
      const json = parseQuerystrToJSON(text);
      data = json;
    }
    return data;
  }
  ctx.setFunc(CONTEXT_FUNC_PARSER_TEXT_KEY, getFormData);
  await next();
}