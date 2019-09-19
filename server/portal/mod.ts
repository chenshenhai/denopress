import { httpServer, } from "./../../deps.ts";

const { serve } = httpServer;

const s = serve("0.0.0.0:8002");

async function main() {
  console.log('------- portal ------');
  for await (const req of s) {
    req.respond({ body: new TextEncoder().encode("Hello Portal\n") });
  }
}

main();
