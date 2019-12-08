import { BaseModel } from "./../../model/base_model.ts";
import { md5 } from "../../../core/util/md5.js";
import { ExecuteResult } from "../../../core/mysql/src/connection.ts";
import { ServiceResult } from "./../types.ts";

export function createPostService(models: {[key: string]: BaseModel}) {

  const serivce = {

    async create(data: {[key: string]: string|number|null}) {
      data.uuid = md5(`${Math.random().toString(26).substr(2)}_${Date.now()}`)
      const result = {
        success: false,
        data: null,
        message: '',
        code: ''
      };
      try {
        const res: ExecuteResult = await models.post.create(data);
        if (res.lastInsertId && res.lastInsertId > 0 && res.affectedRows === 1) {
          result.success = true;
        } else {
          result.code = 'DATABASE_INSERT_FAIL';
        }
      } catch (err) {
        result.success = false;
        result.message = err.stack;
        result.code = 'DATABASE_ERROR';
      }
      return result;
    },

    async query(data: {[key: string]: string|number}) {
      data.password = md5(data.password as string);
      const result: ServiceResult = {
        success: true,
        data: null,
        message: '',
        code: '',
      };
      try {
        const res = await models.post.query(data) as ExecuteResult;
        result.data = res;
      } catch (err) {
        result.success = false;
        result.message = err.stack;
        result.code = 'DATABASE_ERROR';
      }
      return result;
    },

  
    async queryByPage(data: {pageNo: number, size: number}) {
      const result: ServiceResult = {
        success: true,
        data: null,
        message: '',
        code: '',
      };
      try {
        const start: number = data.pageNo * data.size;
        const offset: number = data.size;
        const res = await models.post.queryByPage(start, offset) as ExecuteResult;
        result.data = res;
      } catch (err) {
        result.success = false;
        result.message = err.stack;
        result.code = 'DATABASE_ERROR';
      }
      return result;
    },
  }

  return serivce;
}