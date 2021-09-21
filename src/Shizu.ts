// ========================= Imports ================================= //

import Client from "./bot/api/Client"
import "dotenv/config"
import "reflect-metadata"

//=============================== Init ================================ //
export const client: Client = new Client();
client.start();
client.prismaData();
client.mongoData();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on("unhandledRejection", (err: any) => {
  return console.log(`\x1b[33m[WARNING]\x1b[0m: ${err.message}\x1b[0m\n${err.stack}`);
});