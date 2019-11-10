import { fs } from "./../deps.ts";
import  * as mysql from "./../core/mysql/mod.ts";

const { readFileStrSync } = fs;
const { Client } = mysql;
const config = {
  hostname: "127.0.0.1",
  username: "root",
  password: "abc123def",
  timeout: 10000,
  pool: 3,
  debug: true,
};

const sqlList = [
  'dp_users.sql',
  'dp_posts.sql',
]

const cwd = Deno.cwd();
const basePath = [cwd, 'sql'].join('/');

function fullPath(pathList: string[]): string {
  return [ ...[basePath], ...pathList].join('/');
}

function readSQLContent(fileName: string): string {
  const fullFilePath: string = fullPath([fileName]);
  const sql: string = readFileStrSync(fullFilePath);
  return sql;
}

async function main() {
  let client = await new Client().connect(config);
  await client.execute(`CREATE DATABASE IF NOT EXISTS denopress_db`);
  await client.execute(`USE denopress_db;`);
  for (let i = 0; i < sqlList.length; i++) {
    const sql = sqlList[i];
    const content = readSQLContent(sql);
    await client.execute(content);
  }
  await client.close();
  console.log("Create all table successfully!")
}

main();