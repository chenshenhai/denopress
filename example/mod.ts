import { fs, path } from "./../deps.ts";
import { createPortalServer } from "./../server/mod.ts";
import { TypeDenopressConfig } from "./../core/types.ts"

const baseDir = Deno.cwd();
const configPath: string = path.join(baseDir, 'denopress.json');
const config: TypeDenopressConfig = fs.readJsonSync(configPath) as TypeDenopressConfig;

const portal = createPortalServer(config, {
  baseDir: path.join(baseDir, 'portal_themes'),
});
portal.start();