import { server } from "./../../deps.ts";

const s = server.serve("0.0.0.0:8002");

async function main() {
  console.log('------- dashboard ------');
  for await (const req of s) {
    req.respond({ body: new TextEncoder().encode("Hello Dashboard\n") });
  }
}

main();

