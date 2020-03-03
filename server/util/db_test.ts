import { asserts } from "./../../deps.ts";
import { Client } from "./../../core/mysql/mod.ts";

const { runTests, test } = Deno;
const {
  assertEquals,
  assertThrowsAsync
} = asserts;

let client: Client;

async function main() {
  const port =3306;
  const db = "dp_demo";
  const password = "abc123def";
  const username = "root";
  const hostname ="127.0.0.1";

  const config = {
    timeout: 10000,
    pool: 3,
    debug: false,
    hostname,
    username,
    port,
    db,
    password
  };
  client = await new Client().connect({ ...config, pool: 1, db: '' });
  // await client.execute(`CREATE DATABASE IF NOT EXISTS ${db}`);
  // await client.close();
  client = await new Client().connect(config);
  
  let result = await client.query(
    "select ?? from ?? ",
    ["name", "dp_users"]
  );

  console.log(result);
  await client.close();

  
  console.log("end");
}

main();
