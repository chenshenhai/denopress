import { fs, path } from "./../../deps.ts";
import { Logger } from "./../util/logger.ts";
import { TypeDenopressConfig } from "./../types.ts";
import  * as mysql from "./../../core/mysql/mod.ts";
import sql from "./asserts/sql.ts";


// import config from "./config.json";

const { readJsonSync } = fs;

const logger = new Logger({
  prefix: 'denopress db',
});


async function initMysql(
  database: string,
  sqlList: string[],
  dbConfig: {[key: string]: string|number|boolean}
) {

  console.log(JSON.stringify(dbConfig));

  const { Client } = mysql;
  let client = await new Client().connect(dbConfig);
  await client.execute(`CREATE DATABASE IF NOT EXISTS ${database}`);
  await client.execute(`USE ${database};`);
  for (let i = 0; i < sqlList.length; i++) {
    const sql = sqlList[i];
    await client.execute(sql);
  }
  await client.close();
  console.log("Create all table successfully!")
}

export async function db(baseDir: string): Promise<void> {
  logger.log('hello db!');
  const configPath = path.join(baseDir, 'denopress.json');
  const config: TypeDenopressConfig = readJsonSync(configPath) as TypeDenopressConfig;
  
  console.log(JSON.stringify(config));

  const dbConfig = {
    hostname: config.database.config.hostname,
    username: config.database.config.username,
    password: config.database.config.password,
    timeout: 10000,
    pool: 3,
    debug: true,
  };
  initMysql(config.database.config.database, sql.sqlList, dbConfig);
}




