import { ThemeServer, TypeThemeServerOpts } from "./mod.ts";

const addr = "127.0.0.1:5001";
const cwd = Deno.cwd();
const baseDir: string = [cwd, 'assets', 'themes'].join("/");

const opts: TypeThemeServerOpts = {
  path: baseDir,
}
const server = new ThemeServer(addr, opts)

async function main() {
  await server.start();
  console.log('start theme server !')
}

main();