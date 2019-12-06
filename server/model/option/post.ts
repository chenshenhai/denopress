import {
  TypeBaseModelOpts,
  TypeModelField,
  TypeModelFieldType,
} from "../base_model.ts";


export const post: TypeBaseModelOpts = {
  tableName: 'dp_posts',
  fields: {
    id: {
      type: TypeModelFieldType.number,
      require: true,
    },
    uuid: {
      type: TypeModelFieldType.string,
      require: true,
    },
    title: {
      type: TypeModelFieldType.string,
      require: true,
    },
    content: {
      type: TypeModelFieldType.string,
      require: true,
    },
    user_name: {
      type: TypeModelFieldType.string,
      require: true,
    },
    user_uuid: {
      type: TypeModelFieldType.string,
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