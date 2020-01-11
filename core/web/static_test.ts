#!/usr/bin/env deno run --allow-run --allow-net
import { testing, asserts, bufio } from "./../../deps.ts";


const { test } = testing;
const { assertEquals, equal } = asserts;
const { BufReader } = bufio

const run = Deno.run;

const testSite = "http://127.0.0.1:5001";

let httpServer: any;
let httpServerReg: any;

async function startHTTPServer() {
  httpServer = run({
    args: [Deno.execPath(), "run", "--allow-net", "--allow-read",  "core/web/static_example.ts", "--", ".", "--cors"],
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

async function startHTTPServerReg() {
  httpServerReg = run({
    args: [Deno.execPath(), "run", "--allow-net", "--allow-read",  "core/web/static_example_regular.ts", "--", ".", "--cors"],
    stdout: "piped"
  });
  const buffer = httpServerReg.stdout;
  const bufReader = new BufReader(buffer);
  await bufReader.readLine();
}

function closeHTTPServerReg() {
  httpServerReg.close();
  httpServerReg.stdout.close();
}

test(async function staticServe() {
  try {
    await startHTTPServer();
    const res1 = await fetch(`${testSite}/static-file/js/index.js`);
    const result1 = await res1.text();
    assertEquals(result1, `console.log("hello world!");`);

    const res2 = await fetch(`${testSite}/static-file/css/index.css`);
    const result2 = await res2.text();
    assertEquals(result2, `body {background: #f0f0f0;}`);

    closeHTTPServer();
  } catch (err) {
    closeHTTPServer();
    throw new Error(err);
  }
});



test(async function staticServeRegexp() {
  try {
    await startHTTPServerReg();
    const res1 = await fetch(`${testSite}/pages/static-file/js/index.js`);
    const result1 = await res1.text();
    assertEquals(result1, `console.log("hello world!");`);

    const res2 = await fetch(`${testSite}/pages/static-file/css/index.css`);
    const result2 = await res2.text();
    assertEquals(result2, `body {background: #f0f0f0;}`);

    closeHTTPServerReg();
  } catch (err) {
    closeHTTPServerReg();
    throw new Error(err);
  }
});
