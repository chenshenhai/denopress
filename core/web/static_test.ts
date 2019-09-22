#!/usr/bin/env deno run --allow-run --allow-net
import { testing, asserts, bufio } from "./../../deps.ts";


const { test, runTests } = testing;
const { assert, equal } = asserts;
const { BufReader } = bufio

const run = Deno.run;

const testSite = "http://127.0.0.1:5001";

let httpServer;

async function startHTTPServer() {
  httpServer = run({
    args: ["deno", "run", "--allow-net", "--allow-read",  "./static_example.ts", ".", "--cors"],
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

test(async function server() {
  try {
    await startHTTPServer();
    const res1 = await fetch(`${testSite}/static-file/js/index.js`);
    const result1 = await res1.text();
    assert(equal(result1, `console.log("hello world!");`));

    const res2 = await fetch(`${testSite}/static-file/css/index.css`);
    const result2 = await res2.text();
    assert(equal(result2, `body {background: #f0f0f0;}`));

    closeHTTPServer();
  } catch (err) {
    closeHTTPServer();
    throw new Error(err);
  }
});

runTests();