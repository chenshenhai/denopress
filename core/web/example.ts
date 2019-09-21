import { Application } from "./application.ts";

const app = new Application();
app.use(async(ctx) => {
  await ctx.setResponseBody('hello web_server!');
})

app.listen('127.0.0.1:3002', () => {
  console.log('start success!');
})