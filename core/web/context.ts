import { server } from "./../../deps.ts";


export class ContextRequest {
  private _sReq: server.ServerRequest;
  private _isFinish: boolean = false;
  private _search: string = '';
  private _urlSearchParams: URLSearchParams;

  constructor(sReq: server.ServerRequest) {
    this._sReq = sReq;
    this._search = this._sReq.url.split('?')[1] || '';
    this._urlSearchParams = new URLSearchParams(this._search);
  }

  getAllHeaders(): object{
    const headers = this._sReq.headers;
    const allHeaders = {};
    for (let [key, val] of headers.entries()) {
      allHeaders[key] = val;
    }
    return allHeaders;
  }

  getURL(): string {
    return this._sReq.url;
  }

  getHeader(key: string): string|null {
    const headers = this._sReq.headers;
    return headers.get(key);
  }

  getSearch(): string {
    return this._search;
  }

  getURLParam(key: string): string|null {
    return this._urlSearchParams.get(key);
  }

  getAllURLParams(): object {
    const searchParams = this._urlSearchParams;
    const params = {};
    for (let [key, val] of searchParams.entries()) {
      params[key] = val;
    }
    return params;
  }

  setHeader(key: string, val: string): boolean {
    if (this.isFinish() === true) {
      return false;
    }
    const headers = this._sReq.headers;
    headers.set(key, val);
    return true;
  }

  async getBodyStream(): Promise<Uint8Array> {
    return this._sReq.body();
  }

  isFinish() {
    return this._isFinish;
  }

  setFinish() {
    this._isFinish = true;
  }
}

export class ContextResponse {
  private _sReq: server.ServerRequest;
  private _status:number =  404;
  private _headers: Headers = new Headers();
  private _bodyText: string = '404 Not Found!';
  private _isFinish: boolean = false;

  constructor(sReq: server.ServerRequest) {
    this._sReq = sReq;
  }

  getStatus(): number {
    return this._status;
  }

  setStatus(status: number): boolean {
    if (this.isFinish() === true) {
      return false;
    }
    this._status = status;
    return true;
  }

  getHeader(key: string): string|undefined {
    return this._headers.get(key);
  }

  setHeader(key: string, val: string): boolean {
    if (this.isFinish() === true) {
      return false;
    }
    this._headers.set(key, val);
    return true;
  }

  setBody(text: string): boolean {
    if (this.isFinish() === true) {
      return false;
    }
    this._bodyText = text;
    return true;
  }

  getBody(): string {
    return this._bodyText;
  }

  flush(): boolean {
    if (this.isFinish() === true) {
      return false;
    }
    const res: server.Response = {
      status: this._status,
      headers: this._headers,
      body: new TextEncoder().encode(this._bodyText),
    }
    this._sReq.respond(res);
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

export class Context {

  // private _sReq: server.ServerRequest;
  // private _isFinish: boolean = false;
  public req: ContextRequest;
  public res: ContextResponse;

  constructor(sReq: server.ServerRequest) {
    this.req = new ContextRequest(sReq);
    this.res = new ContextResponse(sReq);
  }

}