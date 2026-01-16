import { App, type Context, cors, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";

export const app = new App<State>();

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

app.get("/doc/:id", (ctx: Context<State>) => {
  const { id } = ctx.params;
  return new Response(JSON.stringify({ id }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
});

// this can also be defined via a file. feel free to delete this!
const exampleLoggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.use(exampleLoggerMiddleware);

// Include file-system based routes here
app.fsRoutes();
