import { Application, Context } from "./mod.ts";
import { bodyTextParser, getBodyTextParserKey } from "./bodyparser.ts";

const app = new Application();
const addr = "127.0.0.1:5001";

app.use(bodyTextParser);

app.use(async (ctx: Context, next: Function) => {
  const method = ctx.req.getMethod();
  const parserText: Function|undefined = ctx.getFunc(getBodyTextParserKey());
  if (method === 'POST' && parserText) {
    const json = await parserText();
    ctx.res.setStatus(200);
    ctx.res.setBody(JSON.stringify(json));
    ctx.res.flush();
  } else if (method === 'GET') {
    let ctxBody = `
    <html>
      <body>
        <form method="POST" action="/">
          <p>userName</p>
          <input name="nickName" /><br/>
          <p>email</p>
          <input name="email" /><br/>
          <button type="submit">submit</button>
        </form>
      </body>
    </html>
    `;
    ctx.res.setStatus(200);
    ctx.res.setBody(ctxBody);
    ctx.res.flush();
  }
  await next();
})

app.listen(addr, function(){
  console.log(`listening on ${addr}`);
});