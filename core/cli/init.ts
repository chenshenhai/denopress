import { fs, path } from "./../../deps.ts"
import config from "./config.json";

const { writeJsonSync } = fs;

export function init(baseDir: string) {
  const fullPath: string = path.join(baseDir, "denopress.json");
  console.log("[Denopress init] [0/1]...");
  console.log("[Denopress init] [0/1]write denopress.json ...");
  config.createTime = Date.now();
  writeJsonSync(fullPath, config, {
    spaces: 2
  });
  console.log("[Denopress init] [1/1]write denopress.json successfully!")
}