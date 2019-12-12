import { BaseModel } from "./../../model/base_model.ts";
import { md5 } from "../../../core/util/md5.js";
import { ExecuteResult } from "../../../core/mysql/src/connection.ts";
import { ServiceResult } from "./../types.ts";

export function createUserService(models: {[key: string]: BaseModel}) {

  const serivce = {

    async create(data: {[key: string]: string|number|null}) {
      data.password = md5(data.password as string);
      data.uuid = md5(`${Math.random().toString(26).substr(2)}_${Date.now()}`)
      const result = {
        success: false,
        data: null,
        message: '',
        code: ''
      };
      try {
        const res: ExecuteResult = await models.user.create(data);
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

    async queryByUuid(uuid: string) {
      const data = {
        uuid,
      }
      const result: ServiceResult = {
        success: false,
        data: null,
        message: '',
        code: 'DATABASE_QUERY_NOT_FOUND',
      };
      try {
        const res = await models.user.query(data) as ExecuteResult;
        
        if (Array.isArray(res) && res[0] && typeof res[0].uuid) {
          const userModel: {[key: string]: string|null|number} = res[0];
          result.success = true;
          result.code = 'SUCCESS';
          result.data = {
            uuid: userModel.uuid,
            name: userModel.name,
            nickname: userModel.nickname,
          };
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
        success: false,
        data: null,
        message: '',
        code: 'DATABASE_QUERY_NOT_FOUND',
      };
      try {
        const res = await models.user.query(data) as ExecuteResult;
        if (Array.isArray(res) && res[0] && typeof res[0].uuid) {
          const userModel: {[key: string]: string|null|number} = res[0];
          result.success = true;
          result.code = 'SUCCESS';
          result.data = {
            uuid: userModel.uuid,
            name: userModel.name,
            nickname: userModel.nickname,
          };
        }
      } catch (err) {
        result.success = false;
        result.message = err.stack;
        result.code = 'DATABASE_ERROR';
      }
      return result;
    },

    async test(data: any) {
      return {
        success: true,
        data: data,
        message: '',
      }
    }
  }

  return serivce;
}