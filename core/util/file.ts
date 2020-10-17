import { fs, path } from "./../../deps.ts";
import { writeJsonSync } from "./json.ts";

export function writeEnsureFileStrSync(filename: string, content: string) {
  const dirname = path.dirname(filename);
  fs.ensureDirSync(dirname);
  Deno.writeTextFileSync(filename, JSON.stringify(content));
};

export function writeEnsureJsonSync(filename: string, content: string, options?: any) {
  const dirname = path.dirname(filename);
  fs.ensureDirSync(dirname);
  writeJsonSync(filename, content, options);
};

// export function makeDirSyncPlus(dirPath: string) {}