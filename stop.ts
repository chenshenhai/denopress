#! deno run --importmap ./import_map.json --allow-all  start.ts

import { readJsonSync } from "fs/read_json.ts";
import { writeJsonSync } from "fs/write_json.ts";

interface DenoPressConfig {
  process: {
    [key: string]: {
      pid: number;
    }
  }
}

async function main() {
  const denopressConfigPath = './.denopress/config.json';
  const config: DenoPressConfig = readJsonSync(denopressConfigPath) as DenoPressConfig;

  console.log(`kill ${JSON.stringify(config.process.portal)} ...`)
  Deno.kill(config.process.portal.pid, Deno.Signal.SIGKILL)
  
  
  console.log(`kill ${JSON.stringify(config.process.dashboard)} ...`)
  Deno.kill(config.process.dashboard.pid, Deno.Signal.SIGKILL)

  config.process.portal = {
    pid: -1,
  };
  config.process.dashboard = {
    pid: -1,
  };
  writeJsonSync(denopressConfigPath, config);
  console.log(`[Denoprocess]: stop successfully!`);
}

main();
