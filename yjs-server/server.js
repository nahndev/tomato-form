import { Server } from "@hocuspocus/server";
import "dotenv/config";

const server = new Server({
  port: process.env.PORT || 3028,
});

server.listen();
