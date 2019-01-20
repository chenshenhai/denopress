#!/usr/bin/env deno --allow-run --allow-net

import { run } from "deno";
import { test, assert } from "./lib/testing.ts";


const httpServer = run({
  args: ["deno", "--allow-net", "./test/server.ts", ".", "--cors"]
});

test(async function testServer() {
  await new Promise(res => setTimeout(res, 3000));
  const res = await fetch("http://127.0.0.1:4321");
  const text = await res.text();
  assert(text === "hello");
  httpServer.close();
})



