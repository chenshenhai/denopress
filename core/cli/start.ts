import { fs, path } from "./../../deps.ts";
import { Logger } from "./../util/logger.ts";
import { TypeDenopressConfig } from "./../types.ts";
import { RemoteThemeLoader, TypeThemeConfig } from "./../theme/mod.ts";

// import config from "./config.json";

const { readJsonSync } = fs;

const logger = new Logger({
  prefix: 'denopress start',
})


export async function start(baseDir: string): Promise<void> {
  const fullPath: string = path.join(baseDir, "denopress.json");
  const config: TypeDenopressConfig = readJsonSync(fullPath) as TypeDenopressConfig;
  logger.log(`${config}`);
  // TODO
  const themeConfList: TypeThemeConfig[] = config.themes;
  const adminThemeConf: TypeThemeConfig = config.adminTheme;
  const remoteLoader = new RemoteThemeLoader({ basePath: fullPath });
  await remoteLoader.loadRemoteTheme(adminThemeConf);
}

