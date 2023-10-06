import { list, record } from "./kv.ts";

export const handler: Deno.ServeHandler = async (req, info) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: new Headers({
        "Allow": "GET",
      }),
    });
  }

  const url = new URL(req.url);

  switch (url.pathname) {
    case "/record": {
      const { fn, ret, ...args } = Object.fromEntries(url.searchParams);
      if (!fn) return new Response("Missing function name", { status: 400 });

      await record({
        name: fn,
        return: ret,
        args: args ?? {},
        source: info.remoteAddr.hostname,
      });

      return new Response("OK");
    }
    case "/list":
      return Response.json(await list());
    default:
      return new Response("Not found", { status: 404 });
  }
};
