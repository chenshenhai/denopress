import { bufio } from "./deps.ts";

const run = Deno.run;
const { BufReader } = bufio;

async function readOneByte(buffer) {
  const chunk = new Uint8Array(1);
  await buffer.read(chunk);
}

async function main() {

  const portalProcess = run({
    args: ["deno", "run",  "--allow-run", "--allow-net", "mod.ts", ".", "--cors"],
    cwd: "./server/portal/",
    stdout: "piped"
  })
  const buffer = portalProcess.stdout;
  const bufReader = new BufReader(buffer);
  await bufReader.readLine();
  console.log('portalProcess = ', portalProcess.pid)
  

  const dashboardProcess = run({
    args: ["deno", "run",  "--allow-run", "--allow-net", "mod.ts", ".", "--cors"],
    cwd: "./server/dashboard/",
    stdout: "piped"
  })
  const dashboardBuf = dashboardProcess.stdout;
  const dashboardReader = new BufReader(dashboardBuf);
  await dashboardReader.readLine();
  console.log('dashboardProcess = ', dashboardProcess.pid)

}

main();
