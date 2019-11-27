import { BaseModel } from "./../../model/base_model.ts";
import { md5 } from "./../../../core/util/md5.js";

export function createUserService(models: {[key: string]: BaseModel}) {
  const serivce = {
    async create(data: {[key: string]: string|number}) {
      data.password = md5(data.password as string);
      const result = {
        success: true,
        data: null,
        message: '',
      };
      try {
        const res = await models.user.create(data);
        result.data = res;
      } catch (err) {
        result.success = false;
        result.message = JSON.stringify(err);
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