#!/usr/bin/env run deno --allow-run --allow-net

import { testing, asserts, bufio } from "./../../deps.ts";

const { test } = testing;
const { assertEquals, equal } = asserts;
const { BufReader } = bufio;


const run = Deno.run;

const testSite = "http://127.0.0.1:5001";

let httpServer: Deno.Process;
async function startHTTPServer() {
  httpServer = run({
    args: [Deno.execPath(), "run", "--allow-net", "core/web/bodyparser_example.ts", "--", ".", "--cors"],
    stdout: "piped"
  });
  let line: string|null = null;
  const buffer: Deno.ReadCloser|undefined = httpServer.stdout;
  if (buffer) {
    const bufReader = new BufReader(buffer);
    let rsline = await bufReader.readLine();
    if (rsline) {
      line = rsline.toString();
    }
  }
  equal(`listening on ${testSite}`, line)
}

function closeHTTPServer() {
  httpServer.close();
  httpServer.stdout && httpServer.stdout.close();
}

test(async function serverPostRequest() {
  try {
    // 等待服务启动
    await startHTTPServer();
    const res = await fetch(`${testSite}/`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: "a=1&b=2&c=3", // body data type must match "Content-Type" header
    });
    const json = await res.json();
    const acceptResult = {"a":"1","b":"2","c":"3"}
    
    assertEquals(json, acceptResult);
    // 关闭测试服务
    closeHTTPServer();
  } catch (err) {
    // 关闭测试服务
    closeHTTPServer();
    throw err;
  }
});
