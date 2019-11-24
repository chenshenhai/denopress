import { Database } from "./../util/database.ts";
import { BaseModel } from "./base_model.ts";
import { user } from "./option/user.ts";

export function createModelMap(db: Database): {[key: string]: BaseModel} {
  const userModel = new BaseModel(user, db);
  return {
    user: userModel,
  }
}