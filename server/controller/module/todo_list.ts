import { TypeThemeServerContext, TypeThemeFrontAPI, TypeThemeAPI } from "./../../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../../core/types.ts";

export function createTodoControllerFrontMap(config: TypeDenopressConfig): TypeThemeFrontAPI {

  return {
    getData: {
      method: 'GET',
      action: async (ctx: TypeThemeServerContext) => {
        const params = await ctx.getUrlParams();
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              todolist: [
                0,1,2,3,4,5,6,7,8,9
              ],
              urlParams: params
            })
          }, 1000);
        });;
      },
    },
  };
}


export function createTodoControllerServerMap(config: TypeDenopressConfig): TypeThemeAPI {

  return {
    async getData(){
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            todolist: [
              0,1,2,3,4,5,6,7,8,9
            ],
          })
        }, 1000);
      })
    }
  }

};

