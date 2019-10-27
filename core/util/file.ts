import { fs, path } from "./../../deps.ts";

export function writeEnsureFileStrSync(filename: string, content: string) {
  const dirname = path.dirname(filename);
  fs.ensureDirSync(dirname);
  fs.writeFileStrSync(filename, content);
};

export function makeDirSyncPlus(dirPath: string) {

}