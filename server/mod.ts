import { ThemeServer } from "./../core/theme/mod.ts";
import serviceTodoList from "./services/todo_list.ts"; 

const addr = "127.0.0.1:8001";
const baseDir: string = [Deno.cwd(), 'themes'].join("/");
const server = new ThemeServer(addr, {
  path: baseDir,
  themeList: [
    "portal",
    "admin",
  ],
  serviceFrontAPI: {
    todoList: serviceTodoList,
  },
  serviceServerAPI: {
    todoList: serviceTodoList,
  },
})

async function main() {
  await server.start();
  console.log('------- portal ------');
}

main();