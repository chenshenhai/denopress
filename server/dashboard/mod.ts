import config from "./../../config.ts";
import { Application } from "./../../core/web/mod.ts";
import { Route, Router } from "./../../core/web_router/mod.ts";
const app = new Application();
const router = new Router();

const addr = `127.0.0.1:${config.dashboardPort}`;
router.get("/mod/:mod/version/:version", async function(ctx) {
  const params = ctx.getData("router");
  ctx.res.setStatus(200);
  ctx.res.setBody(`${JSON.stringify(params)}`);
});

app.use(router.routes());

app.listen(addr, function(){
  console.log(`listening on ${addr}`);
});