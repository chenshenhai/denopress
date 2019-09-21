import { writeResponse, writeResponse, Response } from "http/server";


export class Context {

  private _sReq: ServerRequest;
  private _res: Response;

  constructor(sReq: ServerRequest) {
    this._sReq = sReq;
  }

  getRequestHeader(key: string): string|undefined {
    const headers = this._sReq.headers;
    return headers.get(key);
  }

  setRequestHeader(key: string, val: string): void {
    const headers = this._sReq.headers;
    headers.set(key, val);
  }

  async getRequestBodyStream(): Promise<Uint8Array> {
    return this._sReq.body();
  }

  async setResponseBody(body: string): Promise<void> {
    return writeResponse(body);
  }

  
}