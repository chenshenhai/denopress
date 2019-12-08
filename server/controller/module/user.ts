import { TypeThemeServerContext, TypeThemeFrontAPI } from "./../../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../../core/types.ts";
import { createServiceMap } from "./../../service/mod.ts";

export function createAdminPostControllerFrontMap(config: TypeDenopressConfig): TypeThemeFrontAPI {
  const service = createServiceMap(config);
  return {
    create: {
      method: 'POST',
      action: async (ctx: TypeThemeServerContext) => {
        const params = await ctx.getBodyParams();
        return service.post.create(params);
      },
    },
    query: {
      method: 'GET',
      action: async (ctx: TypeThemeServerContext) => {
        const params = await ctx.getUrlParams();
        return service.post.query(params);
      },
    },
    queryByPage: {
      method: 'GET',
      action: async (ctx: TypeThemeServerContext) => {
        const params = await ctx.getUrlParams();
        return service.post.queryByPage(params);
      },
    },
  };
}