import { fs, path } from "./../../deps.ts";

export function writeEnsureFileStrSync(filename: string, content: string) {
  const dirname = path.dirname(filename);
  fs.ensureDirSync(dirname);
  fs.writeFileStrSync(filename, content);
};

export function writeEnsureJsonSync(filename: string, content: string, options?: fs.WriteJsonOptions) {
  const dirname = path.dirname(filename);
  fs.ensureDirSync(dirname);
  fs.writeJsonSync(filename, content, options);
};

export function makeDirSyncPlus(dirPath: string) {

}