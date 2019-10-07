#!/usr/bin/env run deno --allow-run --allow-net

import { testing, asserts, bufio } from "./../../deps.ts";

const { test, runTests  } = testing;
const { assert, equal } = asserts;
const { BufReader } = bufio;


const run = Deno.run;

const testSite = "127.0.0.1:5001";

let httpServer: Deno.Process;
async function startHTTPServer() {
  httpServer = run({
    args: ["deno", "run", "--allow-net", "./mod_example.ts", ".", "--cors"],
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

test(async function server() {
  try {
    await startHTTPServer();
    const res = await fetch(`http://${testSite}/hello?a=1&b=2`);
    const result = await res.text();
    const expectRes = {
      "method": "GET",
      "general": {
        "url": "/hello?a=1&b=2",
        "path": "/hello",
        "query": {
          "a": "1",
          "b": "2"
        }
      },
      "headers": {
        "user-agent": `Deno/${Deno.version.deno}`,
        "accept": "*/*",
        "accept-encoding": "gzip",
        "host": "127.0.0.1:5001"
      }
    }

    assert(equal(expectRes, JSON.parse(result)));
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