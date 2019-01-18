import { Server } from "../index.ts";

const app = new Server();
const addr = "127.0.0.1:3001";

app.use(async function(ctx, next) {
  const {req, res} = ctx;
  console.log('action 1');
  res.setBody(`middleware 001`);
  await next();
  console.log('action 6');
});

app.use(async function(ctx, next) {
  const {req, res} = ctx;
  console.log('action 2');
  res.setBody(`middleware 002`);
  await next();
  console.log('action 5');
});

app.use(async function(ctx, next) {
  const {req, res} = ctx;
  console.log('action 3');
  res.setBody(`middleware 003`);
  await next();
  console.log('action 4');
});

app.listen(addr, function(){
  console.log(`listening on ${addr}`);
});