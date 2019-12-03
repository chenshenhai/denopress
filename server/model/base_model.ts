import { Database } from "./../util/database.ts";
import { parseToCamelName, parseToLineName } from "./name.ts";

export enum TypeModelFieldType {
  string = 'string',
  number = 'number',
  json = 'json',
};

export interface TypeModelField {
  type: TypeModelFieldType;
  require: boolean;
}


export interface TypeBaseModelOpts {
  tableName: string;
  fields: {
    [key: string]: TypeModelField;
  }
}

export interface ModelResult {
  [key: string]: string|number|null
}

export class BaseModel {
  private _opts: TypeBaseModelOpts;
  private _database: Database;
  private _lineNameMap: Map<string, string>;
  private _camelNameMap: Map<string, string>;

  constructor(opts: TypeBaseModelOpts, db: Database) {
    this._opts = opts;
    this._database = db;
    const lineNameMap: Map<string, string> = new Map();
    const camelNameMap: Map<string, string> = new Map();

    const lineNameList = Object.keys(opts.fields);

    lineNameList.forEach((lineName: string) => {
      const camelName: string = parseToCamelName(lineName);
      lineNameMap.set(lineName, camelName);
      camelNameMap.set(camelName, lineName);
    })

    this._lineNameMap = lineNameMap;
    this._camelNameMap = camelNameMap;
  }

  async create(data: {[key: string]: string|number|boolean }): Promise<any> {
    const keyValList: string[] = [];
    const database: Database = this._database;
    for (const key in data) {
      const lineName: string|undefined = this._camelNameMap.get(key);
      if (typeof lineName === 'string') {
        keyValList.push(`${lineName}='${data[key] || ''}'`);
      } else {
        throw Error(`the field named ${parseToLineName(key)} is undefined`)
      }
    }
    const sql = `
      INSERT INTO \`${this._opts.tableName}\`
      set ${keyValList.join(', ')};`;
    const res = await database.clientExec(sql);
    return res;
  }

  async query(data: {[key: string]: string|number|boolean }): Promise<ModelResult[]> {
    const keyValList: string[] = [];
    const database: Database = this._database;
    for (const key in data) {
      const lineName: string|undefined = this._camelNameMap.get(key);
      if (typeof lineName === 'string') {
        keyValList.push(`${lineName}='${data[key] || ''}'`);
      } else {
        throw Error(`the field named ${key}(${parseToLineName(key)}) is undefined`)
      }
    }
    const sql = `SELECT * FROM \`${this._opts.tableName}\` WHERE ${keyValList.join(' AND ')};`;
    const res = await database.clientExec(sql);
    const result: ModelResult[] = [];
    if (res.rows) {
      res.rows.forEach((item: {[key: string]: any}) => {
        const data: ModelResult = {};
        for (const [lineName, camelName] of this._lineNameMap.entries()) {
          if (camelName) {
            data[camelName] = item[lineName];
          }
        }
        result.push(data);
      });
    }
    return result;
  }
}