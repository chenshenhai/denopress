import {
  TypeThemeConfig
} from "./theme/types.ts";

export interface TypeDenopressConfig {
  createTime: number;
  themes: TypeThemeConfig[];
  adminThemes: TypeThemeConfig[];
}