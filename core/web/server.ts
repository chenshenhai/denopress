import { serve } from "http/server.ts";
import { Context } from "./context.ts";

export class Server {

  private _addr: string;
  private _handler: Function = () => {};

  async createServer(handler) {
    this._handler = handler;
  }

  async listen(addr: string) {
    const ser = serve(addr);
    for await (const req of ser) {
      const ctx: Context = new Context(req);
      this._handler(ctx);
    }
  }

}