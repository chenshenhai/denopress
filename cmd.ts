// import { Commander } from "./core/commander/mod.ts";
// const commander = new Commander({version: "0.0.1"});
// commander.setSubcommand("init", {
//   info: "initialize demo",
//   method: () => {
//     console.log("hello init subcommand");
//   }
// });
// commander.execute();


import { init } from "./core/cli/init.ts";
import { start } from "./core/cli/start.ts";
// import { initHome } from "./core/cli/lib/home.ts";

import { Commander } from "./core/commander/mod.ts";

const commander = new Commander({version: "0.0.1"});
const baseDir: string = Deno.cwd();
(async () => {
  commander.setSubcommand("init", {
    info: "initialize a denopress.json",
    method: () => {
      init(baseDir);
    }
  });
  
  commander.setSubcommand("start", {
    info: "load theme basic resources and start web",
    method: () => {
      start(baseDir);
    }
  });
  
  commander.execute();
})()
