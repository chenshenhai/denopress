import { compose } from "./compose.ts";
import { Server } from "./server.ts";
import { Context } from "./context.ts";


const exit = Deno.exit;

class Application {

  private _middlewares: Function[];
  private _server?: Server;

  constructor() {
    this._middlewares = [];
    // 内置一个服务对象
  }

  /**
   * 注册使用中间件
   * @param fn {Function}
   */
  public use(fn: Function): void {
    this._middlewares.push(fn);
  }

  /**
   * 开始监听服务
   * @param addr {string} 监听地址和端口 0.0.0.0:0000
   * @param fn {Function} 监听执行后的回调
   */
  public async listen(addr: string, fn?: Function) {
    const that = this;
    const server = new Server();
    this._server = server;
    
    // 启动HTTP服务
    server.createServer(async function(ctx) {
      const middlewares = that._middlewares;
      try {
        // 等待执行所有中间件
        await compose(middlewares)(ctx);
        await ctx.flush();
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
   * 统一错误处理
   * @param err {Error} 错误对象
   * @param ctx {SafeContext} 当前HTTP上下文
   */
  private async _onError(err: Error, ctx: Context) {
    console.log(err);
    if (ctx instanceof Context) {
      // 出现错误，把错误堆栈打印到页面上
      ctx.res.setBody(err.stack);
      ctx.res.setStatus(500);
      await ctx.res.flush();
    } else {
      exit(1);
    }
  }
}

export { Application };