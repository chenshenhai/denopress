import {
  fs, path,
} from "./../../../deps.ts";
import manage from "./../asserts/manage.json";

const { HOME } = Deno.env();
const HOME_DENOPRESS_DIR: string = path.join(HOME, '.denopress');
const HOME_DENOPRESS_MANAGE_FILE: string = path.join(HOME_DENOPRESS_DIR, 'manage.json');

export interface TypeHomeManageInfo {
  process: {
    [key: string]: TypeHomeManageInfoProcess
  }
}

export interface TypeHomeManageInfoProcess {
  pid: number;
  path: string;
  createTime: number;
}

export function initHome(): void {
  initHomeDir();
  initHomeManageInfo();
}

export function initHomeDir(): void {
  if (fs.existsSync(HOME_DENOPRESS_DIR)) {
    return;
  }
  fs.ensureDirSync(HOME_DENOPRESS_DIR);
}

export function initHomeManageInfo() {
  if (!fs.existsSync(HOME_DENOPRESS_MANAGE_FILE)) {
    fs.writeJsonSync(HOME_DENOPRESS_MANAGE_FILE, manage, { spaces: 2});
  }
}

export function writeHomeManageInfo(manage: TypeHomeManageInfoProcess): void {
  fs.writeFileStrSync(HOME_DENOPRESS_MANAGE_FILE, JSON.stringify(manage, null, 2));
}

export function readHomeManageInfo(): TypeHomeManageInfoProcess|undefined {
  let info: TypeHomeManageInfoProcess|undefined = undefined;
  if (!fs.existsSync(HOME_DENOPRESS_MANAGE_FILE)) {
    info = fs.readJsonSync(HOME_DENOPRESS_MANAGE_FILE) as TypeHomeManageInfoProcess;
  }
  return info;
}