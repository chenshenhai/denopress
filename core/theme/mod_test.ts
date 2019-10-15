#!/usr/bin/env deno run --allow-run --allow-net

import { testing, asserts, bufio } from "./../../deps.ts";

const { test, runTests  } = testing;
const { assert, equal } = asserts;
const { BufReader } = bufio;
const run = Deno.run;

const testAddr = "127.0.0.1:5001";

const testSite = `http://${testAddr}`;

let httpServer;

async function startHTTPServer() {
  httpServer = run({
    args: ["deno", "run", "--allow-all", "./mod_example.ts", ".", "--cors"],
    stdout: "piped"
  });
  const buffer = httpServer.stdout;
  const bufReader = new BufReader(buffer);
  await bufReader.readLine();
}

function closeHTTPServer() {
  httpServer.close();
  httpServer.stdout.close();
}

function sleep(time = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time)
  })
}

test(async function startServer() {
  await startHTTPServer();
  await sleep(3000);
  assert(equal(1, 1));
})

test(async function themeRender() {
  try {
    const res = await fetch(`${testSite}/page/theme_demo/testing`);
    const result = await res.text();
    const expectResult = `<html ><head ><title >testing</title></head><body ><p >hello world</p></body></html>`;
    assert(equal(expectResult, result));
    // closeHTTPServer();
  } catch (err) {
    // closeHTTPServer();
    throw new Error(err);
  }
});

test(async function themeFrontApi() {
  const res = await fetch(`${testSite}/api/testFront/getData`);
  const result = await res.json();
  assert(equal(result, { type: "front", todolist: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }));
});

test(async function closeServer() {
  await closeHTTPServer();
  assert(equal(1, 1));
})

runTests();