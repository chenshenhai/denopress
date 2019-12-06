import { TypeThemeAPI, TypeThemeFrontAPI } from "./../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../core/types.ts";
import { TypeDatabaseOpts, Database } from "./../util/database.ts";
import { createModelMap } from "./../model/mod.ts";
import { createUserService } from "./service/user.ts";
import { createPostService } from "./service/post.ts";



export function createPortalServiceFrontMap(config: TypeDenopressConfig): {[key: string]: TypeThemeFrontAPI} {
  const dbOpts: TypeDatabaseOpts = config.database.config;
  const db = new Database(dbOpts);
  const models = createModelMap(db);
  const userService = createUserService(models);
  const postService = createPostService(models);
  return {
    user: {
      create: {
        method: 'POST',
        action: userService.create,
      },
      query: {
        method: 'GET',
        action: userService.query,
      },
    },
    post: {
      create: {
        method: 'POST',
        action: postService.create,
      },
      query: {
        method: 'GET',
        action: postService.query,
      },
    }
  };
}