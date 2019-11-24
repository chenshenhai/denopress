import { Application } from "./mod.ts";
import { staticServe } from "./static.ts";

const cwd = Deno.cwd

const app = new Application();
const addr = "127.0.0.1:5001";
const baseDir = [cwd(), "core/web/assets"].join("/");

const staticMiddleware = staticServe(`${baseDir}/$0/`, {
  prefix: `^/([a-z]{1,})/static-file/`,
  regular: true,
});

app.use(staticMiddleware);

app.listen(addr, function(){
  console.log(`listening on ${addr}`);
});