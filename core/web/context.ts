import { server } from "./../../deps.ts";


export class ContextRequest {
  private _sReq: server.ServerRequest;
  private _isFinish: boolean = false;
  private _path: string = '';
  private _search: string = '';
  private _urlSearchParams: URLSearchParams;

  constructor(sReq: server.ServerRequest) {
    this._sReq = sReq;
  
    const url: string = this._sReq.url || '';
    const urlList = url.split('?');

    this._path = urlList[0] || '';
    this._search = urlList[1] || '';
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

  getMethod(): string {
    return this._sReq.method;
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

  getPath(): string {
    return this._path;
  }

  getURLParam(key: string): string|null {
    return this._urlSearchParams.get(key);
  }

  getAllURLParams(): object {
    const searchParams: URLSearchParams = this._urlSearchParams;
    const params = {};

    // for (let key of searchParams.keys()) {
    //   const val = searchParams.get(val);
    //   params[key] = val;
    // }
    
    const queryStr: string = searchParams.toString();
    const queryStrList: string[] = queryStr.split('&');
    queryStrList.forEach((str: string) => {
      const data = str.split('=');
      const key: string = data[0];
      const val: string = data[1];
      params[key] = val;
    })

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

  public req: ContextRequest;
  public res: ContextResponse;

  private _dataMap: Map<string, object|string|number> = new Map();

  constructor(sReq: server.ServerRequest) {
    this.req = new ContextRequest(sReq);
    this.res = new ContextResponse(sReq);
  }

  public setData(key: string, val: object|string|number) {
    this._dataMap.set(key, val);
  }

  public getData(key: string): object|string|number {
    const val = this._dataMap.get(key);
    return val;
  }

  public cleanData() {
    for (const key of this._dataMap.keys()) {
      this._dataMap.delete(key);
    }
  }

  public hasData(key: string): boolean {
    return this._dataMap.has(key);
  }

  public deleteData(key: string) {
    this._dataMap.delete(key);
  }

}