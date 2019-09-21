import { serve } from "http/server.ts"

const s = serve("0.0.0.0:8001");

async function main() {
  console.log('------- dashboard ------');
  for await (const req of s) {
    req.respond({ body: new TextEncoder().encode("Hello Dashboard\n") });
  }
}

main();
