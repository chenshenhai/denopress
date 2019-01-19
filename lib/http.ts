import { listen, Conn, exit } from "deno";
import { Request, Req } from "./request.ts";
import { Response, Res } from "./response.ts";
import { Ctx, Context } from "./context.ts";
import compose from "./compose.ts";

export class Server {
  private middlewares: Function[];
  private context?: Ctx;

  constructor() {
    this.middlewares = [];
    // this.context = {};
  }

  private pushMiddleware(fn: Function): void{
    this.middlewares.push(fn);
  }

  public use(fn: Function): void {
    this.pushMiddleware(fn);
  }

  private createCtx(req: Req, res: Res): Ctx {
    const context = new Context(req, res);
    this.context = context;
    return context;
  }

  private callback() {
    const that = this;
    const handleRequest = async (conn: Conn) => {
      const req: Req = new Request(conn);
      const res: Res = new Response(conn, req);
      await req.init();
      const ctx = that.createCtx(req, res);
      const middlewares = that.middlewares;
      compose(middlewares)(ctx).catch(err => that.onError(err));
    };
    return handleRequest;
  }

  private onError(err: Error) {
    console.log(err);
    const ctx = this.context;
    if (ctx instanceof Context) {
      ctx.res.setBody(err.stack);
      ctx.res.setStatus(500);
      ctx.res.end();
    } else {
      exit(1);
    }
  }

  private async loop(conn: Conn): Promise<void> {
    const handleRequest = this.callback();
    await handleRequest(conn);
  }

  public async listen(addr: string, fn?: Function) {
    const listener = listen("tcp", addr);
    let err: Error = null;
    try {
      if (typeof fn === "function") {
        fn();
      }
      while (true) {
        const conn = await listener.accept();
        await this.loop(conn);
      }
    } catch (error) {
      err = error;
      this.onError(err);
    }
  }
}