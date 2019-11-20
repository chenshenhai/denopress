#!/usr/bin/env deno run --allow-run --allow-net

import { testing, asserts, bufio } from "./../../deps.ts";

const { test, runTests  } = testing;
const { assertEquals, equal } = asserts;
const { BufReader } = bufio;
const run = Deno.run;

const testAddr = "127.0.0.1:5001";

const testSite = `http://${testAddr}`;

let httpServer: any;

async function startHTTPServer() {
  httpServer = run({
    args: ["deno", "run", "--allow-net", "./router_example.ts", ".", "--cors"],
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
    // 等待服务启动
    await startHTTPServer();
    const res1 = await fetch(`${testSite}/hello`);
    const result1 = await res1.text();
    assertEquals(result1, "page_hello");

    const res2 = await fetch(`${testSite}/foo`);
    const result2 = await res2.text();
    assertEquals(result2, "page_foo");

    const res3 = await fetch(`${testSite}/bar`);
    const result3 = await res3.text();
    assertEquals(result3, "page_bar");

    const res4 = await fetch(`${testSite}/page/p001/user/u001`);
    const result4 = await res4.json();
    assertEquals(result4, {"pageId":"p001","userId":"u001"});
    
    closeHTTPServer();
  } catch (err) {
    closeHTTPServer();
    throw new Error(err);
  }
});

runTests();