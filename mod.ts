import { init } from "./core/cli/init.ts";
import { start } from "./core/cli/start.ts";

const args = Deno.args;
const baseDir: string = Deno.cwd();
const order = args[1]; // TODO

async function main() {
  if (order === 'init') {
    init(baseDir);
  } else if (order === 'start') {
    start(baseDir);
  }
}

main();