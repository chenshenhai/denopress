import { Database } from "./../util/database.ts";

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

export class BaseModel {
  private _opts: TypeBaseModelOpts;
  private _database: Database;

  constructor(opts: TypeBaseModelOpts, db: Database) {
    this._opts = opts;
    this._database = db;
  }

  async create(data: {[key: string]: string|number|boolean }): Promise<any> {
    const keyValList: string[] = [];
    const database: Database = this._database;
    for (const key in data) {
      keyValList.push(`${key}='${data[key] || ''}'`);
    }
    const sql = `
      INSERT INTO \`${this._opts.tableName}\`
      set ${keyValList.join(', ')};`;
    const res = await database.clientExec(sql);
    return res;
  }

  async query(data: {[key: string]: string|number|boolean }) {
    const keyValList: string[] = [];
    const database: Database = this._database;
    for (const key in data) {
      keyValList.push(`${key}='${data[key] || ''}'`);
    }
    const sql = `SELECT * FROM \`${this._opts.tableName}\` WHERE ${keyValList.join(' AND ')};`;
    const res = await database.clientExec(sql);
    return res;
  }
}