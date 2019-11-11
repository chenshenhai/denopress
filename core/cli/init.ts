import { fs, path, bufio } from "./../../deps.ts";
import { Logger } from "./../util/logger.ts";
import config from "./asserts/denopress.json";
import { TypeDenopressConfig } from "./../types.ts";
import { RemoteThemeLoader, TypeThemeConfig, } from "./../theme/mod.ts";
import { initHomeDir } from "./lib/home.ts";
import { Input } from "./../commander/input.ts";

const { writeJsonSync } = fs;

const logger = new Logger({
  prefix: 'denopress init',
})


function readStdinLine(limitLen: number = 64): string {
  const chunk = new Uint8Array(limitLen);
  Deno.stdin.readSync(chunk);
  const decoder = new TextDecoder();
  const text = decoder.decode(chunk);
  return text.trim();
}

export async function init(baseDir: string) {
  initHomeDir();
  const fullPath: string = path.join(baseDir, "denopress.json");
  logger.log("init denopress.json ...");

  const inputSQLUsername = new Input("Please input mysql username: ");
  const username = await inputSQLUsername.listenInput();

  const inputSQLPassword = new Input("Please input mysql password: ");
  const password = await inputSQLPassword.listenInput();

  const inputSQLDatabase = new Input("Please input mysql database: ");
  const database = await inputSQLDatabase.listenInput();

  config.createTime = Date.now();
  config.database.config.username = username;
  config.database.config.password = password;
  config.database.config.database = database;
  writeJsonSync(fullPath, config, {
    spaces: 2
  });
  logger.log("write denopress.json successfully!")

  const adminThemeConf: TypeThemeConfig = config.themesAdmin[0];
  const themeConf: TypeThemeConfig = config.themesPortal[0];
  initAdminThemeAsync(baseDir, adminThemeConf).then(() => {
    logger.log("admin theme is initialization completed! ");
    initPortalThemeAsync(baseDir, themeConf).then(() => {
      logger.log("portal theme is initialization completed! ");
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
  
}


async function initAdminThemeAsync(baseDir: string, adminThemeConf: TypeThemeConfig): Promise<void> {
  const adminThemesBaseDir = path.join(baseDir, "themes_admin");
  const adminRemoteLoader = new RemoteThemeLoader({ baseDir: adminThemesBaseDir });
  return adminRemoteLoader.loadRemoteTheme(adminThemeConf);
}

async function initPortalThemeAsync(baseDir: string, portalThemeConf: TypeThemeConfig): Promise<void> {
  const portalThemesBaseDir = path.join(baseDir, "themes");
  const adminRemoteLoader = new RemoteThemeLoader({ baseDir: portalThemesBaseDir });
  return adminRemoteLoader.loadRemoteTheme(portalThemeConf);
}


