import { fs, path } from "./../../deps.ts";
import { Logger } from "./../util/logger.ts";
import { TypeDenopressConfig } from "./../types.ts";
import { RemoteThemeLoader, TypeThemeConfig, } from "./../theme/mod.ts";

// import config from "./config.json";

const { readJsonSync } = fs;

const logger = new Logger({
  prefix: 'denopress start',
})


export async function start(baseDir: string): Promise<void> {
  const fullPath: string = path.join(baseDir, "denopress.json");
  const config: TypeDenopressConfig = readJsonSync(fullPath) as TypeDenopressConfig;
  
  const adminThemeConf: TypeThemeConfig = config.adminThemes[0];
  const themeConf: TypeThemeConfig = config.themes[0];
  // await remoteLoader.loadRemoteTheme(adminThemeConf);

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
  const adminThemesBaseDir = path.join(baseDir, "admin_themes");
  const adminRemoteLoader = new RemoteThemeLoader({ baseDir: adminThemesBaseDir });
  return adminRemoteLoader.loadRemoteTheme(adminThemeConf);
}

async function initPortalThemeAsync(baseDir: string, portalThemeConf: TypeThemeConfig): Promise<void> {
  const portalThemesBaseDir = path.join(baseDir, "themes");
  const adminRemoteLoader = new RemoteThemeLoader({ baseDir: portalThemesBaseDir });
  return adminRemoteLoader.loadRemoteTheme(portalThemeConf);
}

