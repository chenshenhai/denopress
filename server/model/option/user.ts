import {
  TypeBaseModelOpts,
  TypeModelField,
  TypeModelFieldType,
} from "../base_model.ts";


export const user: TypeBaseModelOpts = {
  tableName: 'dp_users',
  fields: {
    id: {
      type: TypeModelFieldType.number,
      require: true,
    },
    uuid: {
      type: TypeModelFieldType.string,
      require: true,
    },
    email: {
      type: TypeModelFieldType.string,
      require: true,
    },
    password: {
      type: TypeModelFieldType.string,
      require: true,
    },
    name: {
      type: TypeModelFieldType.string,
      require: true,
    },
    nick: {
      type: TypeModelFieldType.string,
      require: true,
    },
    detail_info: {
      type: TypeModelFieldType.json,
      require: true,
    },
    created_time: {
      type: TypeModelFieldType.string,
      require: true,
    },
    modified_time: {
      type: TypeModelFieldType.string,
      require: true,
    },
  }
}