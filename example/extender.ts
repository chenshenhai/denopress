import { Server } from "../index.ts";

const app = new Server();
const addr = "127.0.0.1:3001";

function createExtender(application) {
  application.registerExtender("jsonp", async function(req, res, params) {
    
  })
}

app.use(async function(ctx, next) {
  const {req, res} = ctx;
  const headerData = req.getHeaders();
  res.setBody(`${JSON.stringify(headerData)}`);
  await next();
});

app.listen(addr, function(){
  console.log(`listening on ${addr}`);
});