#! /usr/bin/env deno run --allow-run --allow-net test.ts

const decoder = new TextDecoder();

const testUnitRunList = [
  {
    args: ["deno", "run", "--allow-run", "--allow-net", "mod_test.ts", ".", "--cors"],
    cwd: "./core/web/",
    stdout: "piped"
  },
  {
    args: ["deno", "run", "--allow-run", "--allow-net", "router_test.ts", ".", "--cors"],
    cwd: "./core/web/",
    stdout: "piped"
  },
  {
    args: ["deno", "run", "--allow-run", "--allow-net", "static_test.ts", ".", "--cors"],
    cwd: "./core/web/",
    stdout: "piped"
  },
  {
    args: ["deno", "run", "--allow-run", "--allow-net", "mod_test.ts", "--allow-read", ".", "--cors"],
    cwd: "./core/theme/",
    stdout: "piped"
  },
  {
    args: ["deno", "run", "--allow-run", "--allow-net", "loader_test.ts", "--allow-read", ".", "--cors"],
    cwd: "./core/theme/",
    stdout: "piped"
  },
  {
    args: ["deno", "run", "--allow-run", "--allow-net", "--allow-read", "mod_test.ts", ".", "--cors"],
    cwd: "./core/template/",
    stdout: "piped"
  },
  {
    args: ["deno", "run", "--allow-run", "--allow-net", "--allow-read", "script_template_test.ts", ".", "--cors"],
    cwd: "./core/template/",
    stdout: "piped"
  }
]

async function runUnitTest(opts: Deno.RunOptions): Promise<string> {
  const unitTest = Deno.run(opts);
  const outStream = await unitTest.output();
  const output = decoder.decode(outStream);
  return output
}

async function *runAllUnitTest(optsList): AsyncIterableIterator<any[]>{
  for (let i = 0; i < optsList.length; i++) {
    let err = null;
    let log = null;
    const opts: Deno.RunOptions = optsList[i];
    try {
      log = await runUnitTest(opts);
    } catch (e) {
      err = e;
    }
    yield [err, log];
  }
}

async function main() {
  for await(const [err, log] of runAllUnitTest(testUnitRunList)) {
    if (err) {
      throw new Error(err);
    } else {
      console.log(log);
    }
  }
}

main();
