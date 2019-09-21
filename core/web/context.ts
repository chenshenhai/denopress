import { server } from "./../../deps.ts";

export class Context {

  private _sReq: server.ServerRequest;
  private _res: server.Response = {
    status: 404,
    headers: new Headers(),
    body: new TextEncoder().encode('404 Not Found!'),
  };
  private _isFinish: boolean = false;


  constructor(sReq: server.ServerRequest) {
    this._sReq = sReq;
  }

  getRequestHeader(key: string): string|undefined {
    const headers = this._sReq.headers;
    return headers.get(key);
  }

  setRequestHeader(key: string, val: string): boolean {
    if (this.isFinish() === true) {
      return false;
    }
    const headers = this._sReq.headers;
    headers.set(key, val);
    return true;
  }

  async getRequestBodyStream(): Promise<Uint8Array> {
    return this._sReq.body();
  }

  setResponseBody(bodyStr: string): boolean {
    if (this.isFinish() === true) {
      return false;
    }
    const body = new TextEncoder().encode(bodyStr);
    this._res.body = body;
    return true;
  }

  setResponseHeader(key: string, val: string) {
    if (this.isFinish() === true) {
      return false;
    }
    this._res.headers.set(key, val);
    return true;
  }

  setResponseStatus(status: number) {
    if (this.isFinish() === true) {
      return false;
    }
    this._res.status = status;
    return true;
  }

  flush(): boolean {
    if (this.isFinish() === true) {
      return false;
    }
    this._sReq.respond(this._res);
    this._isFinish = true;
    return true;
  }

  isFinish() {
    return this._isFinish;
  }

  setFinish() {
    this._isFinish = true;
  }

}