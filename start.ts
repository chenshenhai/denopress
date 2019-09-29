#! deno run --importmap ./import_map.json --allow-all  start.ts


import { bufio, fs } from "./deps.ts";
const { readJsonSync, writeJsonSync } = fs;

const run = Deno.run;
const { BufReader } = bufio;

interface DenoPressConfig {
  process: {
    [key: string]: {
      pid: number;
    }
  }
}

async function main() {

  const server = run({
    args: ["deno", "run", "--allow-read", "--allow-run", "--allow-net", "server/mod.ts", ".", "--cors"],
    cwd: "./",
    stdout: "piped"
  })
  const buffer = server.stdout;
  const bufReader = new BufReader(buffer);
  await bufReader.readLine();

  // reset process config
  const denopressConfigPath = './.denopress/config.json';
  const config: DenoPressConfig = readJsonSync(denopressConfigPath) as DenoPressConfig;

  config.process.server = {
    pid: server.pid,
  };


  writeJsonSync(denopressConfigPath, config, { spaces: 2});
  
  console.log(`[Denoprocess]: start successfully!`);
}

main();
