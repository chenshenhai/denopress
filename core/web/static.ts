// Thanks to:
// https://github.com/chenshenhai/deno_note/blob/master/demo/web_static/mod.ts


import { Context } from "./context.ts";

const readFileSync = Deno.readFileSync;
const lstatSync = Deno.lstatSync

const decoder = new TextDecoder();

interface ServeOptions {
  prefix?: string;
  regular?: boolean;
}

/**
 * @param {string} fullFilePath 
 * @return {string}
 */
function renderFile( fullFilePath: string) {
  const bytes = readFileSync(fullFilePath);
  const content = decoder.decode(bytes);
  return content;
}

/**
 * @param {string} path
 * @param {object} opts
 *  opts.prefix {string}
 * @param {string}
 */
function pathFilter(path: string, opts: ServeOptions = {}) {
  const prefix: string = (opts && opts.prefix) ? opts.prefix : "";
  const regular: boolean = (opts && opts.regular) ? opts.regular : false;
  let result = "";
  if (regular === true) {
    const prefixReg = new RegExp(prefix)
    result = path.replace(prefixReg, "");
  } else {
    result = path.replace(prefix, "");
  }
  
  // 过滤掉路径里 ".." "//" 字符串，防止越级访问文件夹
  result = result.replace(/[\.]{2,}/ig, "").replace(/[\/]{2,}/ig, "/");
  return result;
}

/**
 * @param {string} baseDir
 * @param {object} options
 *  opts.prefix {string}
 * @param {function}
 */
function serve(baseDir: string, options: ServeOptions = {}): Function {
  const { prefix = '', regular = false, } = options || {};

  let isLegalPath: Function = function(pathname) {
    return options && typeof prefix === "string" && pathname.indexOf(options.prefix) === 0;
  }

  let prefixReg:RegExp|null = null;
  if (regular === true && typeof prefix === 'string') {
    prefixReg = new RegExp(prefix);
    isLegalPath = function(pathname) {
      return prefixReg.test(pathname);
    }
  }
  

  return async function(ctx: Context, next) {
    await next();
    const {req, res} = ctx;
    const pathname = req.getPath();
    
    if ( options && isLegalPath(pathname) ) {
      const path = pathFilter(pathname, options);
      let fullPath = `${baseDir}${path}`;
      if (regular === true) {
        const matchList = pathname.match(prefixReg);
        Array.isArray(matchList) && matchList.forEach((m, idx) => {
          if (idx > 0 && m && typeof m === 'string') {
            fullPath = fullPath.replace(`\$${idx - 1}`, m);
          }
        })
      }

      let result = `${path} is not found!`;
      try {
        const stat = lstatSync(fullPath);
        if (stat.isFile() === true) {
          result = renderFile(fullPath);
          res.setStatus(200);
        }
      } catch (err) {
        throw new Error(err);
      }
      res.setBody(`${result}`);
      res.flush();
      res.setFinish();
    }
  };
}

export const staticServe = serve;
