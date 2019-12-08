import { server } from "./../../deps.ts";
import { Context } from "./context.ts";

export class Server {

  // private _addr: string;
  private _handler: Function = () => {};

  async createServer(handler: Function) {
    this._handler = handler;
  }

  async listen(addr: string) {
    const ser = server.serve(addr);
    for await (const req of ser) {
      const ctx: Context = new Context(req);
      this._handler(ctx);
    }
  }

}