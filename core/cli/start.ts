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
  logger.log('hello world!');
}


