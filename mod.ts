import { init } from "./core/cli/init.ts";

const args = Deno.args;
const baseDir: string = Deno.cwd();
const order = args[1]; // TODO

if (order === 'start') {
  init(baseDir);
}