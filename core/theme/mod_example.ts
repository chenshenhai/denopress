import { ThemeServer, ThemeServerOptsType } from "./server.ts";

const addr = "127.0.0.1:5001";
const cwd = Deno.cwd();
const baseDir: string = [cwd, 'assets', 'theme_demo'].join("/");

const opts: ThemeServerOptsType = {
  path: baseDir,
}
const server = new ThemeServer(addr, opts)

async function main() {
  await server.start();
  console.log('start theme server !')
}

main();