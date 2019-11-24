import { TypeThemeAPI, TypeThemeFrontAPI } from "./../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../core/types.ts";
import { TypeDatabaseOpts, Database } from "./../util/database.ts";
import { createModelMap } from "./../model/mod.ts";
import { createUserService } from "./service/user.ts";



export function createPortalServiceFrontMap(config: TypeDenopressConfig): {[key: string]: TypeThemeFrontAPI} {
  const dbOpts: TypeDatabaseOpts = config.database.config;
  const db = new Database(dbOpts);
  const models = createModelMap(db);
  const serviceMap = createUserService(models);
  return {
    user: {
      create: {
        method: 'GET',
        action: serviceMap.create,
      },
      test: {
        method: 'GET',
        action: serviceMap.test,
      },
    },
  };
}