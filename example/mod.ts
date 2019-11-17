import { fs, path } from "./../deps.ts";
import { createPortalServer, createAdminServer } from "./../server/mod.ts";
import { TypeDenopressConfig } from "./../core/types.ts"

const baseDir = Deno.cwd();
const configPath: string = path.join(baseDir, 'denopress.json');
const config: TypeDenopressConfig = fs.readJsonSync(configPath) as TypeDenopressConfig;

const portal = createPortalServer(config, {
  baseDir: path.join(baseDir, 'portal_themes'),
});
const admin = createAdminServer(config, {
  baseDir: path.join(baseDir, 'admin_themes'),
});

(async () => {
  await admin.start();
  await portal.start();
})();