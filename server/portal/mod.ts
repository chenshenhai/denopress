import { ThemeServer } from "./../../core/theme/mod.ts";


const addr = "127.0.0.1:8001";
const cwd = Deno.cwd();
const pathList: string[] = cwd.split('/');
pathList.pop();
pathList.pop();
pathList.push()
const baseDir: string = [Deno.cwd(), 'theme', 'portal'].join("/");
const server = new ThemeServer(addr, {
  path: baseDir,
})

async function main() {
  await server.start();
  console.log('------- portal ------');
}

main();