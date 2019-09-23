#! deno run --importmap ./import_map.json --allow-all  start.ts


import { bufio, readJSON, writeJSON } from "./deps.ts";
const { readJsonSync } = readJSON;
const { writeJsonSync } = writeJSON;

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

  const portalProcess = run({
    args: ["deno", "run", "--allow-read", "--allow-run", "--allow-net", "server/portal/mod.ts", ".", "--cors"],
    cwd: "./",
    stdout: "piped"
  })
  const buffer = portalProcess.stdout;
  const bufReader = new BufReader(buffer);
  const portalLog =  await bufReader.readLine();
  // console.log(portalLog);

  const dashboardProcess = run({
    args: ["deno", "run", "--allow-read", "--allow-run", "--allow-net", "server/dashboard/mod.ts", ".", "--cors"],
    cwd: "./",
    stdout: "piped"
  })
  const dashboardBuf = dashboardProcess.stdout;
  const dashboardReader = new BufReader(dashboardBuf);
  const dashboardLog = await dashboardReader.readLine();
  // console.log(dashboardLog);

  // reset process config
  const denopressConfigPath = './.denopress/config.json';
  const config: DenoPressConfig = readJsonSync(denopressConfigPath) as DenoPressConfig;

  config.process.portal = {
    pid: portalProcess.pid,
  };
  config.process.dashboard = {
    pid: dashboardProcess.pid,
  };


  writeJsonSync(denopressConfigPath, config);
  
  console.log(`[Denoprocess]: start successfully!`);
}

main();
