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
    query: {
      method: 'GET',
      action: async (ctx: TypeThemeServerContext) => {
        const params = await ctx.getUrlParams();
        return service.user.query(params);
      },
    },
  };
}