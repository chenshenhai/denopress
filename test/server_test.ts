#!/usr/bin/env deno --allow-run --allow-net

import { run } from "deno";
import { test, assert } from "./lib/testing.ts";


const httpServer = run({
  args: ["deno", "--allow-net", "./test/server.ts", ".", "--cors"]
});

const testSite = "http://127.0.0.1:4321";

test(async function testServer() {
  await new Promise(res => setTimeout(res, 1000));
  const res = await fetch(testSite);
  const text = await res.text();
  assert(text === "hello");
  httpServer.close();
})

// test(async function testServerContextData() {
//   await new Promise(res => setTimeout(res, 1500));
//   const queryMap = {
//     key1: "123",
//     key2: "abc",
//   }
//   const res = await fetch(`${testSite}/testCtxData.html?key1=123&key2=abc`);
//   const json = await res.json();
//   console.log('json ===', json);
//   assert("hello" === "hello");
//   httpServer.close();
// })



