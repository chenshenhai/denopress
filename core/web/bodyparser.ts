import { Context } from "./context.ts";

export async function bodyParser(ctx: Context, next: Function) {
  const method = ctx.req.getMethod();
}