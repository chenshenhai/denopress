import { compose } from "./compose.ts";
import { Server } from "./server.ts";
import { Context } from "./context.ts";

const exit = Deno.exit;

class Application {

  private _middlewares: Function[];
  private _server?: Server;

  constructor() {
    this._middlewares = [];
  }

  /**
   * @param fn {Function}
   */
  public use(fn: Function): void {
    this._middlewares.push(fn);
  }

  /**
   * @param addr {string}  0.0.0.0:0000
   * @param fn {Function} 
   */
  public async listen(addr: string, fn?: Function) {
    const that = this;
    const server = new Server();
    this._server = server;
    
    server.createServer(async function(ctx) {
      const middlewares = that._middlewares;
      try {
        await compose(middlewares)(ctx);
        await ctx.res.flush();
      } catch (err) {
        that._onError(err, ctx);
      }
    }); 
    server.listen(addr);
    if (typeof fn === "function") {
      fn();
    }
  }

  /**
   * @param err {Error} 
   * @param ctx {SafeContext} 
   */
  private async _onError(err: Error, ctx: Context) {
    console.log(err);
    if (ctx instanceof Context) {
      ctx.res.setBody(err.stack);
      ctx.res.setStatus(500);
      await ctx.res.flush();
    } else {
      exit(1);
    }
  }
}

export { Application };