import { TypeThemeServerContext, TypeThemeFrontAPI } from "./../../../core/theme/types.ts";
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

    loginUserInfo: {
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