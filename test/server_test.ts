#!/usr/bin/env deno --allow-run --allow-net

import { run } from "deno";
import { test, assert, assertEqual } from "https://raw.githubusercontent.com/denoland/deno_std/v0.2.6/testing/mod.ts";

const httpServer = run({
  args: ["deno", "--allow-net", "./test/server_example.ts", ".", "--cors"]
});

test(async function testServer() {
  await new Promise(res => setTimeout(res, 5000));
  const res = await fetch("http://127.0.0.1:4321");
  const text = await res.text();
  console.log('text = ', text);
  assertEqual(text, 'hello');
  httpServer.close();
})