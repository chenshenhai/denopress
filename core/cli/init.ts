import { fs, path } from "./../../deps.ts";
import { Logger } from "./../util/logger.ts";
import config from "./config.json";
import { TypeDenopressConfig } from "./../types.ts";
import { RemoteThemeLoader, TypeThemeConfig, } from "./../theme/mod.ts";

const { writeJsonSync } = fs;

const logger = new Logger({
  prefix: 'denopress init',
})


export async function init(baseDir: string) {
  const fullPath: string = path.join(baseDir, "denopress.json");
  logger.log("write denopress.json ...");
  config.createTime = Date.now();
  writeJsonSync(fullPath, config, {
    spaces: 2
  });
  const adminThemeConf: TypeThemeConfig = config.adminThemes[0];
  const themeConf: TypeThemeConfig = config.themes[0];

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
  logger.log("[1/1]write denopress.json successfully!")
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


