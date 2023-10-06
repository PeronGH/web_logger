import { Hono } from "https://deno.land/x/hono@v3.7.5/mod.ts";
import { list, record } from "./kv.ts";

export const app = new Hono();

app.get("/record", async (ctx) => {
  const { fn, ret, ...args } = <Record<string, string>> Object.fromEntries(
    Object.entries(ctx.req.queries())
      .map(([key, value]) => [key, value.at(0)])
      .filter(([key, value]) => key && value),
  );

  if (!fn) return ctx.text("Missing function name", 400);

  await record({
    name: fn,
    return: ret,
    args,
  });

  return ctx.text("OK");
});

app.get("/list", async (ctx) => ctx.json(await list()));
