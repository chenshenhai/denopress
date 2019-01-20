import { Server } from "../index.ts";

const app = new Server();
const addr = "127.0.0.1:3001";

app.use(async function(ctx, next) {
  const { req, res } = ctx;
  const sreach = req.getSearch();
  const query = {};
  if (typeof sreach === "string") {
    const paramStrList = sreach.split('&');
    paramStrList.forEach(function(paramStr) {
      const paramList = paramStr.split("=");
      const key = paramList[0];
      const val = paramList[1];
      if (typeof key === "string" && key.length > 0 && typeof val === "string" && val.length > 0) {
        query[key] = val;
      }
    })
  }
  ctx.setData("query", query);
  await next();
});

app.use(async function(ctx, next) {
  const {res} = ctx;
  const queryData = ctx.getData("query"); 
  res.setBody(`${JSON.stringify(queryData)}`);
  await next();
});

app.listen(addr, function(){
  console.log(`listening on ${addr}`);
});