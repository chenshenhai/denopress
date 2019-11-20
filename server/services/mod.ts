import { TypeThemeAPI } from "./../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../core/types.ts";
import { TypeDatabaseOpts, Database } from "./../util/database.ts";
import { createModelMap } from "./../models/mod.ts";
import { createUserService } from "./service/user.ts";



export function createPortalServiceMap(config: TypeDenopressConfig): {[key: string]: TypeThemeAPI} {
  const dbOpts: TypeDatabaseOpts = config.database.config;
  const db = new Database(dbOpts);
  const models = createModelMap(db);
  return {
    user: createUserService(models),
  };
}