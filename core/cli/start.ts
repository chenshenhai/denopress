import { fs, path } from "./../../deps.ts";
import { Logger } from "./../util/logger.ts";
import config from "./config.json";

const { readJsonSync } = fs;

const logger = new Logger({
  prefix: 'denopress start',
})


export function start(baseDir: string) {
  const fullPath: string = path.join(baseDir, "denopress.json");
  const config = readJsonSync(fullPath);
  logger.log(`${config}`);
}

