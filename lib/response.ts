import { Conn } from "deno";
import { Req } from "./request.ts";
import { getMIME } from "./mime.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const CRLF = "\r\n";
const default404Body = "404 Not Found!";

export interface Res {
  judgeEnd: Function;
  setStatus: Function;
  getStatus: Function;
  setProtocol: Function;
  getProtocol: Function;
  setHeader: Function;
  getHeaders: Function;
  setBody: Function;
  getBody: Function;
  end: Function;
}

export class Response implements Res {
  private conn: Conn;
  private general: {};
  private headers: {};
  private body : string;
  private isEnd: boolean;
  private req: Req;

  constructor(conn: Conn, req: Req) {
    this.conn = conn;
    this.req = req;
    this.isEnd = false;
    this.general = {
      status: 200,
      protocol: "HTTP/1.1",
    };
    this.headers = {};
  }

  public getProtocol() {
    return this.general['protocol'] || "HTTP/1.1";
  }

  public setProtocol() {
    // TODO
  }

  public getStatus() {
    return this.general['status'];
  }

  public setStatus(status: number) {
    this.general['status'] = status;
  }

  public judgeEnd(): boolean {
    const isEnd = this.isEnd;
    return isEnd;
  }

  public setHeader(key:string, val:string): void {
    const headerKey = key.toLocaleLowerCase();
    const headerVal = val.toLocaleLowerCase();
    const headerItem = {};
    headerItem[headerKey] = `${headerVal}`;
    this.headers = {...{}, ...this.headers, ...headerItem};
  }

  public getHeader(key:string) {
    return this.headers[key];
  }

  public getHeaders(): {} {
    const headers = this.headers || {};
    return headers;
  }

  public setBody(body: string) {
    this.body = body;
  }

  public getBody(): string {
    const body = this.body;
    return body;
  }
  
  public end(): void {
    const conn = this.conn;
    const req = this.req;
    const headers = req.getHeaders();
    const { pathname } = headers;
    if ( !headers["content-type"] ) {
      const mime = getMIME(pathname);
      this.setHeader("content-type", mime);
    }
    if (this.isEnd !== true) {
      if (conn && conn.close && typeof conn.close === "function") {
        const result = this.getResult();
        this.isEnd = true;
        this.conn.write(result);
        this.conn.close();
      }
    }
  }

  private getResult (): Uint8Array {
    let body = this.getBody();
    if (!(typeof body === 'string' && body.length > 0)) {
      body = default404Body;
    }
    const headers = this.getHeadersLines();
    let resHeaders = [];
    if ( Array.isArray(headers) === true && headers.length > 0) {
      resHeaders = [...resHeaders, ...headers];
    }
    const ctx = encoder.encode(resHeaders.join(CRLF));
    const ctxBody = encoder.encode(body);
    const data = new Uint8Array(ctx.byteLength + (ctxBody ? ctxBody.byteLength : 0));
    data.set(ctx, 0);
    if (ctxBody) {
      data.set(ctxBody, ctx.byteLength);
    }
    return data;
  }

  private getHeadersLines(): string[] {
    const lines = [];
    const body = this.getBody();
    const headers = this.getHeaders();
    const protocol = this.getProtocol();
    const status = this.getStatus();
    const contentLength = headers["content-length"] || `content-length: ${body.length}`;
  
    // lines.push(`HTTP/1.1 200`);
    lines.push(`${protocol} ${status}`);
    lines.push(contentLength);

    const keywords = ["content-length"];
    for (const key in headers) {
      const val = headers[key];
      if (key && typeof key === "string" && val && typeof val === "string") {
        if (keywords.indexOf(key.toLocaleLowerCase()) < 0) {
          lines.push(`${key}: ${val}`);
        }
      }
    }
    lines.push(`${CRLF}`);
    return lines;
  }
  
}
