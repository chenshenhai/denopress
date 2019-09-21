import { server } from "./../../deps.ts";

const s = server.serve("0.0.0.0:8002");

async function main() {
  console.log('------- portal ------');
  for await (const req of s) {
    req.respond({ body: new TextEncoder().encode("Hello Portal\n") });
  }
}

main();
