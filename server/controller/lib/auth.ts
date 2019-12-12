import { TypeThemeServerContext, TypeThemeFrontAPI } from "./../../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../../core/types.ts";
import { createServiceMap } from "./../../service/mod.ts";

const COOKIE_AUTH_KEY = 'uuid';

export interface TypeLoginUserInfo {
  isLogin: boolean;
  nickname?: string;
  name?: string;
  uuid?: string;
}

export function createLibAuthController(config: TypeDenopressConfig): {[key: string]: Function} {
  const service = createServiceMap(config);
  const COOKIE_TIME = 1000 * 60 * 60;

  return {

    getLoginUserInfo: async (ctx: TypeThemeServerContext): Promise<TypeLoginUserInfo> => {
      
      const cookies = await ctx.getCookies();
      const uuid = cookies[COOKIE_AUTH_KEY];
      const res: any = await service.user.queryByUuid(uuid);
      const userInfo: TypeLoginUserInfo = {
        isLogin: false,
      }
      if (res.success === true && res.data && res.data.name) {
        userInfo.isLogin = true;
        userInfo.name = res.data.name;
        userInfo.nickname = res.data.nickname;
      }
      userInfo.uuid = uuid;
      return userInfo;
    },

    setLoginStatus(ctx: TypeThemeServerContext, uuid: string) {
      ctx.setCookie({
        name: COOKIE_AUTH_KEY, 
        value: uuid,
        expires: new Date(Date.now() + COOKIE_TIME),
        httpOnly: true,
        path: '/'
      });
    },

  };
}