#!/usr/bin/env run deno --allow-run --allow-net

import { testing, asserts, bufio } from "./../../deps";

const { test, runTests  } = testing;
const { assert, equal } = asserts;
const { BufReader } = bufio;


const run = Deno.run;

const testSite = "http://127.0.0.1:3001";

let httpServer;
async function startHTTPServer() {
  httpServer = run({
    args: ["deno", "run", "--allow-net", "./test_server.ts", ".", "--cors"],
    stdout: "piped"
  });
  const buffer = httpServer.stdout;
  const bufReader = new BufReader(buffer);
  const line = await bufReader.readLine();
  equal(`listening on ${testSite}`, line)
}

function closeHTTPServer() {
  httpServer.close();
  httpServer.stdout.close();
}

test(async function server() {
  try {
    await startHTTPServer();
    const res1 = await fetch(`${testSite}/hello`);
    const result1 = await res1.text();
    assert(equal(result1, "page_hello"));
    // close testing server
    closeHTTPServer();
  } catch (err) {
    // close testing server
    closeHTTPServer();
    throw new Error(err);
  }
});

// start
runTests()