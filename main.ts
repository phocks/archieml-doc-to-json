import { load } from "@std/dotenv";
import { App, type Context, cors, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";

const env = await load({
  export: true,
});

export const app = new App<State>();

const client_id = Deno.env.get("GOOGLE_CLIENT_ID");
const client_secret = Deno.env.get("GOOGLE_CLIENT_SECRET");
const refresh_token = Deno.env.get("GOOGLE_REFRESH_TOKEN");
const fileId = Deno.env.get("GOOGLE_FILE_ID");

const docConfig = {
  web: {
    redirect_uris: ["not set"],
    client_id,
    client_secret,
    oAuthTokens: {
      refresh_token,
    },
  },
};

app.use(staticFiles());
app.use(cors({ origin: "*" }));

// Pass a shared value from a middleware
app.use(async (ctx: Context<State>) => {
  ctx.state.shared = "hello";
  return await ctx.next();
});

// this is the same as the /api/:name route defined via a file. feel free to delete this!
app.get("/api2/:name", (ctx: Context<State>) => {
  const name = ctx.params.name;
  return new Response(
    `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
  );
});

// this can also be defined via a file. feel free to delete this!
const exampleLoggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.use(exampleLoggerMiddleware);

// Include file-system based routes here
app.fsRoutes();
