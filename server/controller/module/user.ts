import { TypeThemeServerContext, TypeThemeFrontAPI, TypeThemeAPI } from "./../../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../../core/types.ts";
import { createServiceMap } from "./../../service/mod.ts";
import { createLibAuthController } from "./../lib/auth.ts";

export function createAdminUserControllerFrontMap(config: TypeDenopressConfig): TypeThemeFrontAPI {
  const service = createServiceMap(config);
  const authController = createLibAuthController(config);
  return {

    create: {
      method: 'POST',
      action: async (ctx: TypeThemeServerContext) => {
        const params = await ctx.getBodyParams();
        return service.user.create(params);
      },
    },


    login: {
      method: 'POST',
      action: async (ctx: TypeThemeServerContext) => {
        const params = await ctx.getBodyParams();
        const res = await service.user.query(params);

        console.log('login.res = ', res);

        if (res.success === true && res.data && res.data.uuid) {
          authController.setLoginStatus(ctx, res.data.uuid);
          return res;
        }
        return {
          success: false,
          data: null,
          code: 'LOGIN_ERROR',
          message: ''
        };
      },
    },

    getLoginUserInfo: {
      method: 'GET',
      action: async (ctx: TypeThemeServerContext) => {
        const loginInfo = await authController.getLoginUserInfo(ctx);
        return {
          success: false,
          data: loginInfo,
          code: 'LOGIN_ERROR',
          message: ''
        };
      },
    }

  };
}


export function createAdminUserControllerServerMap(config: TypeDenopressConfig): TypeThemeAPI {
  // const service = createServiceMap(config);
  const authController = createLibAuthController(config);
  return {
    async getLoginUserInfo (ctx: TypeThemeServerContext) {

      console.log('server=======')
      const loginInfo = await authController.getLoginUserInfo(ctx);
      return {
        success: false,
        data: loginInfo,
        code: 'LOGIN_ERROR',
        message: ''
      };
    },

  };
}