import { Req } from "./request.ts";
import { Res } from "./response.ts";

export interface Ctx {
  req: Req;
  res: Res;
  setData: Function;
  getData: Function;
  cleanData: Function;
  hasData: Function;
  deleteData: Function;

  registerExtender: Function;
  isExtenderExist: Function;
  getExtender: Function;
}

export class Context implements Ctx {
  public req: Req;
  public res: Res;
  private dataMap;
  private extenderMap;
  
  constructor(req: Req, res: Res) {
    this.req = req;
    this.res = res;
    this.dataMap = {};
    this.extenderMap = {};
  }

  public setData(key: string, val: any) {
    if (!this.dataMap) {
      this.dataMap = {};
    }
    this.dataMap[key] = val;
  }

  public getData(key: string) {
    const dataMap = this.dataMap || {};
    const val = dataMap[key];
    return val;
  }

  public cleanData() {
    this.dataMap = {};
  }

  public hasData(key: string) {
    const dataMap = this.dataMap || {};
    return dataMap.hasOwnProperty(key);
  }

  public deleteData(key: string) {
    if (this.dataMap) {
      delete this.dataMap[key];
    }
  }

  public registerExtender(key: string, extender: Function) {
    const isExist = this.isExtenderExist(key);
    if (isExist === true) {
      throw new Error(`Extender: ${key} is existed. Please rename extender key!`)
    } else {
      this.extenderMap[key] = extender;
    }
  }

  public async getExtender(key: string) {
    return this.extenderMap[key];
  }

  public isExtenderExist(key: string) {
    const extenderMap = this.extenderMap || {};
    return extenderMap.hasOwnProperty(key);
  }
  
}
