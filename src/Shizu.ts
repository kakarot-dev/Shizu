// ========================= Imports ================================= //

import Client from "./bot/api/Client"
import "dotenv/config"
import "reflect-metadata"
import Rollbar from 'rollbar'

//=============================== Init ================================ //
export const client: Client = new Client();
client.start();
client.rollbar = new Rollbar({
    accessToken: process.env.rollbar_TOKEN as string,
    captureUncaught: true,
    captureUnhandledRejections: true
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on("unhandledRejection", (err: any) => {
   console.log(`\x1b[33m[WARNING]\x1b[0m: ${err.message}\x1b[0m\n${err.stack}`);
  return
});