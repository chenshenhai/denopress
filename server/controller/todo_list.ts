import { TypeThemeAPI } from "./../../core/theme/types.ts";

const api: TypeThemeAPI =  {
  async getData(): Promise<object> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          todolist: [
            0,1,2,3,4,5,6,7,8,9
          ]
        })
      }, 1000);
    });
  } 
} 

export default api;