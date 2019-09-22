// Thanks to:
// https://github.com/chenshenhai/deno_note/blob/master/demo/web_static/mod.ts


import { Context } from "./context.ts";

const readFileSync = Deno.readFileSync;
const lstatSync = Deno.lstatSync

const decoder = new TextDecoder();

interface ServeOptions {
  prefix: string;
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
function pathFilter(path: string, opts?: ServeOptions) {
  const prefix = (opts && opts.prefix) ? opts.prefix : "";
  let result = "";
  result = path.replace(prefix, "");
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
function serve(baseDir: string, options?: ServeOptions): Function {
  return async function(ctx: Context, next) {
    await next();
    const {req, res} = ctx;
    const pathname = req.getPath();

    if ( options && typeof options.prefix === "string" && pathname.indexOf(options.prefix) === 0 ) {
      const path = pathFilter(pathname, options);
      const fullPath = `${baseDir}${path}`;
      let result = `${path} is not found!`;
      try {
        const stat = lstatSync(fullPath);
        if (stat.isFile() === true) {
          result = renderFile(fullPath);
          res.setStatus(200);
        }
      } catch (err) {
        // throw new Error(err);
      }
      res.setBody(`${result}`);
      res.flush();
      res.setFinish();
    }
  };
}

export const staticServe = serve;
