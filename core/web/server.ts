import { httpServer } from "./../../deps.ts";
import { Context } from './'

const  { serve } = httpServer;

export class Server {


  private _addr: string;

  constructor(addr: string) {
    this._addr = addr;
  }

  async createServer(handler) {
    const addr: string = this._addr;
    const ser = serve(addr);
    for await (const req of ser) {
      handler()
      req.respond({ body: new TextEncoder().encode("Hello World\n") });
    }
  }

}