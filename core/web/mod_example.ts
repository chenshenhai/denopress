import {
  Application,
  Context,
  ContextRequest,
  ContextResponse,
} from "./mod.ts";

const app = new Application();
app.use(async(ctx: Context) => {
  const req: ContextRequest = ctx.req;
  const res: ContextResponse = ctx.res;
  
  const reqData = {
    general: {
      url: req.getURL(),
      query: req.getAllURLParams(),
    },
    headers: req.getAllHeaders(),
  }

  res.setStatus(200);
  await res.setBody(`${JSON.stringify(reqData)}`);
})

app.listen('127.0.0.1:3002', () => {
  console.log('start success!');
})