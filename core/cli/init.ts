import { fs, path } from "./../../deps.ts";
import { Logger } from "./../util/logger.ts";
import config from "./config.json";

const { writeJsonSync } = fs;

const logger = new Logger({
  prefix: 'Denopress init',
})

export function init(baseDir: string) {
  const fullPath: string = path.join(baseDir, "denopress.json");
  logger.log("[0/1]...");
  logger.log("[0/1]write denopress.json ...");
  config.createTime = Date.now();
  writeJsonSync(fullPath, config, {
    spaces: 2
  });
  logger.log("[1/1]write denopress.json successfully!")
}