import { TypeThemeServerContext, TypeThemeFrontAPI } from "./../../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../../core/types.ts";
import { createServiceMap } from "./../../service/mod.ts";

export function createAdminUserControllerFrontMap(config: TypeDenopressConfig): TypeThemeFrontAPI {
  const service = createServiceMap(config);
  return {
    create: {
      method: 'POST',
      action: async (ctx: TypeThemeServerContext) => {
        const params = await ctx.getBodyParams();
        return service.user.create(params);
      },
    },

    // getLoginUserInfo: {
    //   method: 'POST',
    //   action: async (ctx: TypeThemeServerContext) => {
    //     const params = await ctx.getBodyParams();
    //     return service.user.create(params);
    //   },
    // },

    login: {
      method: 'POST',
      action: async (ctx: TypeThemeServerContext) => {
        const params = await ctx.getUrlParams();
        const COOKIE_TIME = 1000 * 60 * 2;
        const res = await service.user.query(params);
        if (res.success === true && res.data && res.data.uuid) {
          ctx.setCookie({
            name: 'uuid', 
            value: res.data.uuid,
            expires: new Date(Date.now() + COOKIE_TIME),
            httpOnly: true,
            path: '/'
          });
          // ctx.redirect('/page/admin/dashboard');
        }
        return {
          success: false,
          data: null,
          code: 'LOGIN_ERROR',
          message: ''
        };
      },
    },
  };
}