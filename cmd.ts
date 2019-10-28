import { Commander } from "./core/commander/mod.ts";

const commander = new Commander({version: "0.0.1"});

commander.setSubcommand("init", {
  info: "initialize demo",
  method: () => {
    console.log("hello init subcommand");
  }
});

commander.execute();