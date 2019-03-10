import { Application } from "./lib/web/mod.ts";
import { Route, Router } from "./lib/web_router/mod.ts";
const app = new Application();
const addr = "127.0.0.1:3001";

const router = new Router();

router.get("/mod/:mod/version/:version", async function(ctx) {
  const params = ctx.getData("router");
  ctx.res.setStatus(200);
  ctx.res.setBody(`${JSON.stringify(params)}`);
});

app.use(router.routes());

app.listen(addr, function(){
  console.log(`listening on ${addr}`);
});
