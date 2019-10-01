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

test(async function server() {
  try {
    await startHTTPServer();
    await sleep(2000);
    const res = await fetch(`${testSite}/page/theme_demo/testing`);
    const result = await res.text();
    const expectResult = `<html ><head ><title >testing</title></head><body ><p >hello world</p></body></html>`;
    assert(equal(expectResult, result));

    closeHTTPServer();
  } catch (err) {
    closeHTTPServer();
    throw new Error(err);
  }
});

runTests();