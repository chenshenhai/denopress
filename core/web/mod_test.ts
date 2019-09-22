#!/usr/bin/env run deno --allow-run --allow-net

import { testing, asserts, bufio } from "./../../deps.ts";

const { test, runTests  } = testing;
const { assert, equal } = asserts;
const { BufReader } = bufio;


const run = Deno.run;

const testSite = "127.0.0.1:5001";

let httpServer;
async function startHTTPServer() {
  httpServer = run({
    args: ["deno", "run", "--allow-net", "./mod_example.ts", ".", "--cors"],
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
    const res = await fetch(`http://${testSite}/hello?a=1&b=2`);
    const result = await res.text();
    const expectRes = {
      "general": {
        "url": "/hello?a=1&b=2",
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