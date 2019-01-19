import { Server } from "./../../index.ts";
const app = new Server();
const addr = "127.0.0.1:4321";

app.use(async function(ctx) {
  const {req, res} = ctx;
  res.setBody(`hello`);
  res.end(200)
});

app.listen(addr, function(){
  console.log(`listening on ${addr}`);
});