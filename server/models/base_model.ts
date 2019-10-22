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
  private _opts: TypeBaseModelOpts

  constructor(opts: TypeBaseModelOpts) {
    this._opts = opts;
  }

  query() {
    
  }
}