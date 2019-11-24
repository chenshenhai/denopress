import { BaseModel } from "./../../model/base_model.ts";

export function createUserService(models: {[key: string]: BaseModel}) {
  const serivce = {
    async create(data: {[key: string]: string|number}) {
      const result = {
        success: true,
        data: null,
        message: '',
      };
      try {
        await models.user.create(data);
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