import { TypeThemeAPI, TypeThemeFrontAPI } from "./../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../core/types.ts";
import { TypeDatabaseOpts, Database } from "./../util/database.ts";
import { createModelMap } from "./../model/mod.ts";
import { createUserService } from "./service/user.ts";
import { createPostService } from "./service/post.ts";



export function createServiceMap(config: TypeDenopressConfig): {[key: string]: {[key: string]: Function}} {
  const dbOpts: TypeDatabaseOpts = config.database.config;
  const db = new Database(dbOpts);
  const models = createModelMap(db);
  const userService = createUserService(models);
  const postService = createPostService(models);
  return {
    user: userService,
    post: postService,
  }
}