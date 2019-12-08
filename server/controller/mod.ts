import { TypeThemeServerContext, TypeThemeFrontAPI } from "./../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../core/types.ts";
import { createServiceMap } from "./../service/mod.ts";

export function createPortalControllerFrontMap(config: TypeDenopressConfig): {[key: string]: TypeThemeFrontAPI} {
  const service = createServiceMap(config);
  return {
    user: {
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
    },
    post: {
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
    }
  };
}