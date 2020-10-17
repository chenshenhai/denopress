import { server, cookie } from "./../../deps.ts";

const { getCookies, setCookie, deleteCookie } = cookie;

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
    const allHeaders: { [key: string]: string } = {};
    for (let [key, val] of headers.entries()) {
      allHeaders[key] = val;
    }
    return allHeaders;
  }

  getCookies(): cookie.Cookies {
    const ck = getCookies(this._sReq);
    return ck;
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

  getAllURLParams(): {[key: string]: string} {
    const searchParams: URLSearchParams = this._urlSearchParams;
    const params: {[key: string]: string} = {};

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
    const stream = await Deno.readAll(this._sReq.body)
    return stream;
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

  setCookie(ck: cookie.Cookie): void {
    const res: server.Response = {
      headers: this._headers,
    }
    setCookie(res, ck);
  }

  deleteCookie(name: string): void {
    const res: server.Response = {
      headers: this._headers,
    }
    deleteCookie(res, name);
  }


  getHeader(key: string): string|null {
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

  redirect(url: string) {
    this.setStatus(302);
    this._headers.set("Location", url);
    this.flush();
  }
}

export class Context {

  public req: ContextRequest;
  public res: ContextResponse;

  private _dataMap: Map<string, object|string|number> = new Map();
  private _funcMap: Map<string, Function> = new Map();

  constructor(sReq: server.ServerRequest) {
    this.req = new ContextRequest(sReq);
    this.res = new ContextResponse(sReq);
  }

  public setData(key: string, val: object|string|number) {
    this._dataMap.set(key, val);
  }

  public getData(key: string): object|string|number|undefined {
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

  public setFunc(key: string, func: Function) {
    this._funcMap.set(key, func);
  }

  public getFunc(key: string): Function|undefined {
    return this._funcMap.get(key);
  }

  public hasFunc(key: string): boolean {
    return this._funcMap.has(key);
  }

  public cleanFunc() {
    for (const key of this._funcMap.keys()) {
      this._funcMap.delete(key);
    }
  }

}