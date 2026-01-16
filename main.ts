import { load } from "@std/dotenv";
import { App, type Context, cors, staticFiles } from "fresh";
// import { docToArchieML } from "@newswire/doc-to-archieml";
import GoogleDocToJSON from "googledoc-to-json";
import { define, type State } from "./utils.ts";

const env = await load({
  // optional: choose a specific path (defaults to ".env")
  // envPath: ".env.local",
  // optional: also export to the process environment (so Deno.env can read it)
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

const gDocToJSON = new GoogleDocToJSON(docConfig.web);

const getArchieMLAsync = (options: any) => {
  return new Promise((resolve, reject) => {
    gDocToJSON.getArchieML(options, (error: Error | null, archieMl: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(archieMl);
      }
    });
  });
};

// import GoogleDocToJSON from "googledoc-to-json";
// import config from "../config.json" with { type: "json" };

// const gDocToJSON = new GoogleDocToJSON(config.web);

// const options = {
// 	fileId: "117rUoPnaLqX0MUoJtjH4ta-oZwxQqtgpj-gETyLjPUg",
// 	oAuthTokens: config.web.oAuthTokens,
// };

// gDocToJSON.getArchieML(options, (error: Error, archieMl: { id: string }) => {
// 	console.log("## ArchieML output", error, JSON.stringify(archieMl));
// });

// let oAuth2Client;

// function authorize(credentials, callback) {
//   const { client_secret, client_id, redirect_uris } = credentials;
//   oAuth2Client = new google.auth.OAuth2(
//     client_id,
//     client_secret,
//     redirect_uris[0],
//   );

//   if (!("refresh_token" in config.tokens)) {
//     getNewToken(oAuth2Client);
//   }

//   if (Date.now() > config.tokens.expiry_date) updateToken(oAuth2Client);

//   oAuth2Client.setCredentials(config.tokens);
//   callback(oAuth2Client);
// }

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

app.get("/doc/:id", async (ctx: Context<State>) => {
  const { id } = ctx.params;

  try {
    const docOptions = {
      fileId: id,
      oAuthTokens: docConfig.web.oAuthTokens,
    };

    const archieMl = await getArchieMLAsync(docOptions);

    return new Response(JSON.stringify(archieMl), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle errors from the library
    console.error("Failed to get ArchieML:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// this can also be defined via a file. feel free to delete this!
const exampleLoggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.use(exampleLoggerMiddleware);

// Include file-system based routes here
app.fsRoutes();
