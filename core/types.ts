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
}