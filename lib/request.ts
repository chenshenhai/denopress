import { Conn } from "deno";

const BUFFER_LENGTH = 1024;
const MB_LIMIT_COUNT = 8;
const decoder = new TextDecoder();
const CRLF = "\r\n";

export interface Req {
  init: Function;
  getMethod: Function;
  getHeaders: Function;
  getCookie: Function;
  getQuery: Function;
  getProtocol: Function;
}

export class Request implements Req {
  private conn: Conn;
  private reqData: {};
  private hasInitialized: boolean;
  
  constructor (conn: Conn) {
    this.conn = conn;
    this.reqData = {};
    this.hasInitialized = false;
  }

  public async init() {
    if (this.hasInitialized !== true) {
      const reqData = await this.getReqData();
      this.reqData = reqData || {};
      this.hasInitialized = true;
    }
  }

  public getMethod() {
    const reqData = this.reqData;
    return reqData["method"];
  }

  public getProtocol(): string {
    const reqData = this.reqData;
    return reqData["protocal"];
  }

  public getHeaders(): object {
    const reqData = this.reqData;
    const headers = Object.assign({}, reqData);
    return headers;
  }

  public getCookie() {
    const reqData = this.reqData || {};
    return reqData["cookie"];
  }

  public getQuery() {
    const reqData = this.reqData || {};
    return reqData["search"];
  }

  private async getReqData(): Promise<object> {
    let buffer = new Uint8Array(BUFFER_LENGTH);
    const conn = this.conn;
    const chunkList = [];
    let isReadOver = false;


    for (let i = 1; i < MB_LIMIT_COUNT; i++) {
      const readResult = await conn.read(buffer);
      chunkList.push(decoder.decode(buffer));
      if (readResult.eof === true || readResult.nread < BUFFER_LENGTH) {
        isReadOver = true;
        break;
      }
    }

    
    const headers = chunkList.join("");
    const headersObj = {};
    const headerList = headers.split(CRLF);
    headerList.forEach(function(item, i) {
      if (i === 0) {
        // headersObj["method"] = item;
        if (typeof item === "string") {
          // example "GET /index/html?a=1 HTTP/1.1";
          const regMatch = /([A-Z]{1,}){1,}\s(.*)\s(.*)/;
          const strList : object = item.match(regMatch) || [];
          const method : string = strList[1] || "";
          const href : string = strList[2] || "";
          const protocol : string = strList[3] || "";
          
          const pathname : string = href.split("?")[0] || "";
          const search : string = href.split("?")[1] || "";
          
          headersObj["method"] = method;
          headersObj["protocol"] = protocol;
          headersObj["href"] = href;
          headersObj["pathname"] = pathname;
          headersObj["search"] = search;
        }
      } else {
        if (typeof item === "string" && item.length > 0) {
          const splitKey = '__$FIRST_COLON$__';
          const itemStr = item.replace(":", splitKey)
          const itemList = itemStr.split(splitKey);
          const key = itemList[0];
          const val = itemList[1];
          let keyStr = null;
          let valStr = null;
          if (key && typeof key === "string") {
            keyStr = key.trim();
          }
          if ( val && typeof val === "string") {
            valStr = val.trim();
          }
          if (typeof keyStr === "string" && typeof valStr === "string") {
            headersObj[keyStr] = valStr.replace(/[\u0000]{1,}$/i, "");
          }
        }
      }
    });
    return headersObj;
  }
}