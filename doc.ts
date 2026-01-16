import { load } from "@std/dotenv";
import GoogleDocToJSON from "googledoc-to-json";

const env = await load({
  // optional: choose a specific path (defaults to ".env")
  // envPath: ".env.local",
  // optional: also export to the process environment (so Deno.env can read it)
  export: true,
});

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

const googleDocToJSON = new GoogleDocToJSON(docConfig.web);

const docOptions = {
  fileId: fileId,
  oAuthTokens: docConfig.web.oAuthTokens,
};

let jsonString = "";

googleDocToJSON.getArchieML(
  docOptions,
  (error: Error, archieMl: { id: string }) => {
    console.log("## ArchieML output", error, JSON.stringify(archieMl));
    jsonString = JSON.stringify(archieMl);

    console.log(jsonString);
  },
);

console.log(jsonString);
