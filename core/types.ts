import {
  TypeThemeConfig
} from "./theme/types.ts";


export interface TypeDenopressConfig {
  createTime: number;
  portalServer: {
    port: number;
  }
  portalThemes: TypeThemeConfig[];
  adminThemes: TypeThemeConfig[];
  adminServer: {
    port: number;
  }
  database: {
    type: string;
    config: {
      hostname: string,
      port: number,
      username: string,
      password: string,
      database: string
    }
  }
}