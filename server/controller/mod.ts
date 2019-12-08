import { TypeThemeFrontAPI, TypeThemeAPI } from "./../../core/theme/types.ts";
import { TypeDenopressConfig } from "./../../core/types.ts";
import { createAdminPostControllerFrontMap } from "./module/user.ts";
import { createAdminUserControllerFrontMap } from "./module/post.ts";

// TODO
import { createTodoControllerFrontMap, createTodoControllerServerMap } from "./module/todo_list.ts";

// TODO
export function createPortalControllerFrontMap(config: TypeDenopressConfig): {[key: string]: TypeThemeFrontAPI} {
  const todoListController = createTodoControllerFrontMap(config);
  return {
    todoList: todoListController,
  };
}

// TODO
export function createPortalControllerServerMap(config: TypeDenopressConfig):  {[key: string]: TypeThemeAPI} {
  const todoListController = createTodoControllerServerMap(config);
  return {
    todoList: todoListController,
  };
}

export function createAdminControllerFrontMap(config: TypeDenopressConfig): {[key: string]: TypeThemeFrontAPI} {
  const userController = createAdminUserControllerFrontMap(config);
  const postController = createAdminPostControllerFrontMap(config);
  const todoListController = createTodoControllerFrontMap(config);
  return {
    user: userController,
    post: postController,

    // TODO
    todoList: todoListController,
  };
}

// TODO
export function createAdminControllerServerMap(config: TypeDenopressConfig):  {[key: string]: TypeThemeAPI} {
  const todoListController = createTodoControllerServerMap(config);
  return {
    todoList: todoListController,
  };
}