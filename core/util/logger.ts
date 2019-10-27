import { log } from "./../../deps.ts";

export interface TypeLoggerOpts {
  prefix: string;
}

export class Logger {
  private _opts: TypeLoggerOpts;
  
  constructor(opts: TypeLoggerOpts) {
    this._opts = opts;
  }

  public log(text: string) {
    console.log(`[${this._opts.prefix}] ${text}`);
  }

  public info(text: string) {
    console.log(`[${this._opts.prefix}] ${text}`);
  }
}